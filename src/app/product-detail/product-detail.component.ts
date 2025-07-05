import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Observable, switchMap, of } from 'rxjs';
import { Product } from '../models/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, CommonModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product$!: Observable<Product>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit() {
    this.product$ = this.route.paramMap.pipe(
      switchMap(params => {
        const slug = params.get('slug');
        if (!slug) {
          return of(undefined);
        }
        return this.productService.getProductBySlug(slug);
      }),
      switchMap(product => {
        if (!product) {
          throw new Error('Product not found');
        }
        return of(product);
      })
    );
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId);
    Swal.fire({
      title: 'Success!',
      text: 'Product added to cart',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Go to Cart',
      cancelButtonText: 'Continue Shopping'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/cart']);
      }
    });
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}
