import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-checkout-success',
  standalone: true,
  imports: [ RouterModule],
  templateUrl: './checkout-success.component.html'
})
export class CheckoutSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);

  orderId: number | null = null;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.orderId = params['orderId'] ? +params['orderId'] : null;
    });
  }
}
