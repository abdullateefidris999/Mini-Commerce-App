import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private productService = inject(ProductService);
  private cartService = inject(CartService);
  private router = inject(Router);

  products$!: Observable<Product[]>;

  ngOnInit() {
    this.products$ = this.productService.products$;

    this.productService.fetchProducts().subscribe({
      next: () => console.log('Products loaded'),
      error: (err) => console.error('Error fetching products:', err)
    });
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
}
