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

  addToCart(productId: number) {
    const currentCart = this.cartSubject.value;
    const existingItem = currentCart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentCart.push({ productId, quantity: 1 });
    }
    this.cartSubject.next([...currentCart]);
    localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
  }

  updateQuantity(productId: number, quantity: number) {
    const currentCart = this.cartSubject.value;
    const item = currentCart.find(i => i.productId === productId);
    if (item) {
      item.quantity = quantity;
      this.cartSubject.next([...currentCart]);
      localStorage.setItem('cart', JSON.stringify(this.cartSubject.value));
    }
  }

  removeFromCart(productId: number) {
    const currentCart = this.cartSubject.value.filter(item => item.productId !== productId);
    this.cartSubject.next(currentCart);
    localStorage.setItem('cart', JSON.stringify(currentCart));
  }

  clearCart() {
    this.cartSubject.next([]);
    localStorage.removeItem('cart');
  }
}
