import { Component, OnInit, inject } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AsyncPipe,CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, RouterModule, CommonModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  private cartService = inject(CartService);


  cartItemCount$!: Observable<number>;

  ngOnInit() {
    this.cartItemCount$ = this.cartService.cart$.pipe(
      map(cart => cart.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
}
