import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderStatusModel } from 'src/app/model/orderstatus/orderstatus.model';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusService {
  private apiUrl = 'https://localhost:7263/api/OrderStatus';

  constructor(private http: HttpClient) {}

  // Sipariş durumlarını getir
  getOrderStatuses(): Observable<OrderStatusModel[]> {
    return this.http.get<OrderStatusModel[]>(`${this.apiUrl}/GetOrderStatuses`);
  }
}
