import { Component, OnInit } from '@angular/core';
import { CartService } from '../services/cart.service';
import { AsyncPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [AsyncPipe, MatToolbarModule, RouterModule],
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  constructor(private cartService: CartService) {}

  cartItemCount$!: Observable<number>;

  ngOnInit() {
    this.cartItemCount$ = this.cartService.cart$.pipe(
      map(cart => cart.reduce((sum, item) => sum + item.quantity, 0))
    );
  }
}
