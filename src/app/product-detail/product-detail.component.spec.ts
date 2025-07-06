import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ProductDetailComponent } from './product-detail.component';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Product } from '../models/product';

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let productService: jasmine.SpyObj<ProductService>;
  let cartService: jasmine.SpyObj<CartService>;
  let router: jasmine.SpyObj<Router>;

  const mockProduct: Product = {
    id: 1,
    name: 'Test Product',
    description: 'Test Description',
    price: 99.99,
    image: '/test.jpg',
    slug: 'test-product'
  };

  beforeEach(async () => {
    // Create spies for our services
    const productServiceSpy = jasmine.createSpyObj('ProductService', ['getProductBySlug']);
    const cartServiceSpy = jasmine.createSpyObj('CartService', ['addToCart']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        { provide: ProductService, useValue: productServiceSpy },
        { provide: CartService, useValue: cartServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: () => 'test-product' })
          }
        }
      ]
    }).compileComponents();

    productService = TestBed.inject(ProductService) as jasmine.SpyObj<ProductService>;
    cartService = TestBed.inject(CartService) as jasmine.SpyObj<CartService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    productService.getProductBySlug.and.returnValue(of(mockProduct));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load product details on init', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.product$.subscribe(product => {
      expect(product).toEqual(mockProduct);
      expect(productService.getProductBySlug).toHaveBeenCalledWith('test-product');
    });
  }));

  it('should add product to cart and show success message', fakeAsync(() => {
    fixture.detectChanges();
    tick();

    component.addToCart(1);
    expect(cartService.addToCart).toHaveBeenCalledWith(1);
  }));

  it('should navigate to cart when goToCart is called', () => {
    component.goToCart();
    expect(router.navigate).toHaveBeenCalledWith(['/cart']);
  });

  it('should handle undefined product slug', fakeAsync(() => {
    const route = TestBed.inject(ActivatedRoute);
    Object.defineProperty(route, 'paramMap', {
      get: () => of({ get: () => null })
    });

    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    tick();

    expect(productService.getProductBySlug).not.toHaveBeenCalled();
  }));
});
