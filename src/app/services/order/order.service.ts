import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderModel } from 'src/app/model/order/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://localhost:7263/api/order';

  constructor(private http: HttpClient) {}

  // Tüm siparişleri getir
  getOrders(): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${this.apiUrl}/GetOrders`);
  }

  // Tek bir siparişi getir
  getOrder(orderId: number): Observable<OrderModel> {
    return this.http.get<OrderModel>(`${this.apiUrl}/GetOrder/${orderId}`);
  }

  // Belirli bir sipariş numarasına ait tüm siparişleri getir
  getOrdersByOrderNumber(orderNumber: string): Observable<OrderModel[]> {
    return this.http.get<OrderModel[]>(`${this.apiUrl}/GetOrdersByOrderNumber/${orderNumber}`);
  }

  // Sipariş oluştur
  createOrder(orderData: any): Observable<{ orderNumber: string; message: string }> {
    return this.http.post<{ orderNumber: string; message: string }>(`${this.apiUrl}/CreateOrder`, orderData);
  }

  // Sipariş güncelle
  updateOrder(orderNumber: string, updateData: any): Observable<string> {
    return this.http.put<string>(`${this.apiUrl}/UpdateOrder/${orderNumber}`, updateData);
  }

  // Siparişten ürün çıkar
  removeProductFromOrder(orderNumber: string, orderId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/RemoveProductFromOrder?orderNumber=${orderNumber}&orderId=${orderId}`);
  }
}
