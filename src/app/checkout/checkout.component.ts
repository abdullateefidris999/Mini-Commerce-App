// checkout.component.ts
import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule // Changed from FormsModule to ReactiveFormsModule
  ],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  checkoutForm: FormGroup;

  constructor(
    private cartService: CartService,
    private router: Router,
    private fb: FormBuilder
  ) {
    // Initialize reactive form
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', Validators.required]
    });
  }

  onSubmit() {
    // Check if form is valid
    if (this.checkoutForm.invalid) {
      alert('Please fill out all fields.');
      return;
    }

    console.log('Form submitted:', this.checkoutForm.value);

    const orderId = Math.floor(100000 + Math.random() * 900000);
    this.cartService.clearCart();
    alert(`Order placed successfully! Your order ID is ${orderId}`);
    this.router.navigate(['/checkout/success'], { queryParams: { orderId } });
  }
}
