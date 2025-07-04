import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      this.cartSubject.next(JSON.parse(savedCart));
    }
  }

  addToCart(productId: number, quantity: number = 1): void {
    const currentCart = [...this.cartSubject.value];
    const itemIndex = currentCart.findIndex(item => item.productId === productId);
    if (itemIndex > -1) {
      currentCart[itemIndex].quantity += quantity;
    } else {
      currentCart.push({ productId, quantity });
    }
    this.updateCart(currentCart);
  }

  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value.filter(item => item.productId !== productId);
    this.updateCart(currentCart);
  }

  updateQuantity(productId: number, quantity: number): void {
    const currentCart = this.cartSubject.value.map(item =>
      item.productId === productId ? { ...item, quantity } : item
    );
    this.updateCart(currentCart);
  }

  clearCart(): void {
    this.updateCart([]);
  }

  private updateCart(cart: CartItem[]): void {
    this.cartSubject.next(cart);
    localStorage.setItem('cart', JSON.stringify(cart));
  }
}
