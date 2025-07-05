import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { CartService } from '../services/cart.service';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, CommonModule, RouterModule],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  products$!: any;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.products$ = this.productService.products$;

    this.productService.fetchProducts().subscribe({
      next: () => console.log('Products loaded'),
      error: (err) => console.error('Error fetching products:', err)
    });
  }

  addToCart(productId: number) {
    this.cartService.addToCart(productId);
    alert('Product added to cart'); // Replaced MatSnackBar
  }
}
