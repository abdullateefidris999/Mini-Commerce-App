import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { ProductService } from '../services/product.service';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { combineLatest, map, Observable } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Product } from '../models/product';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, CommonModule,FormsModule, RouterModule],
  templateUrl: './cart.component.html'
})
export class CartComponent implements OnInit {
  private cartService = inject(CartService);
  private productService = inject(ProductService);

  cartItems$!: Observable<{ product: Product; quantity: number }[]>; // Explicitly define the type
  total$!: Observable<number>;

  ngOnInit() {
    // Initialize cartItems$ and total$ inside ngOnInit
    this.cartItems$ = combineLatest([this.cartService.cart$, this.productService.products$]).pipe(
      map(([cart, products]) => cart.map(item => ({
        product: products.find(p => p.id === item.productId)!,
        quantity: item.quantity
      })))
    );

    this.total$ = this.cartItems$.pipe(
      map((items: { product: Product; quantity: number }[]) => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0))
    );
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
    Swal.fire({
      title: 'Removed!',
      text: 'Product removed from cart',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false
    });
  }
}
