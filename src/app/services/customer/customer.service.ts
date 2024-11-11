import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CustomerModel } from 'src/app/model/customer/customer.model';
import { CreateCustomerModel } from 'src/app/model/customer/create-customer.model';
import { UpdateCustomerModel } from 'src/app/model/customer/update-customer.model';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://localhost:7263/api/customer'; // API URL'si

  constructor(private http: HttpClient) {}

  // Tüm müşterileri getir
  getCustomers(): Observable<CustomerModel[]> {
    return this.http.get<CustomerModel[]>(`${this.apiUrl}/GetCustomers`);
  }

  // Yeni müşteri ekle
  addCustomer(customer: CreateCustomerModel): Observable<CustomerModel> {
    return this.http.post<CustomerModel>(`${this.apiUrl}/AddCustomer`, customer);
  }

  // Mevcut bir müşteriyi güncelle
  updateCustomer(customerId: number, customer: UpdateCustomerModel): Observable<CustomerModel> {
    return this.http.put<CustomerModel>(`${this.apiUrl}/UpdateCustomer/${customerId}`, customer);
  }

  // Müşteriyi sil
  deleteCustomer(customerId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/DeleteCustomer/${customerId}`);
  }
}
