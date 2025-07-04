import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([]);
  public products$ = this.productsSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchProducts(): Observable<Product[]> {
    const products = localStorage.getItem('products');
    if (products) {
      this.productsSubject.next(JSON.parse(products));
      return this.products$;
    } else {
      return this.http.get<Product[]>('assets/products.json').pipe(
        tap(data => {
          localStorage.setItem('products', JSON.stringify(data));
          this.productsSubject.next(data);
        })
      );
    }
  }

  getProductBySlug(slug: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => products.find(p => p.slug === slug))
    );
  }
}
