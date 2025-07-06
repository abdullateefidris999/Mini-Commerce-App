// checkout.component.ts
import { Component, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './checkout.component.html'
})
export class CheckoutComponent {
  private cartService = inject(CartService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  checkoutForm: FormGroup;

  constructor() {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cardNumber: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.checkoutForm.invalid) {
      Swal.fire({
        title: 'Error!',
        text: 'Please fill out all fields correctly.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      return;
    }

    console.log('Form submitted:', this.checkoutForm.value);

    const orderId = Math.floor(100000 + Math.random() * 900000);
    this.cartService.clearCart();

    Swal.fire({
      title: 'Success!',
      text: `Order placed successfully! Your order ID is ${orderId}`,
      icon: 'success',
      confirmButtonText: 'OK'
    }).then((result) => {
      if (result.isConfirmed) {
        this.router.navigate(['/checkout/success'], { queryParams: { orderId } });
      }
    });
  }
}
