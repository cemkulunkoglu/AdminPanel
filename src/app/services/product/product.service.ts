import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductModel } from 'src/app/model/product/product.model';
import { CreateProductModel } from 'src/app/model/product/create-product.model';
import { UpdateProductModel } from 'src/app/model/product/update-product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'https://localhost:7263/api/product';

  constructor(private http: HttpClient) {}

  // Tüm ürünleri getir
  getProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.apiUrl}/GetProducts`);
  }

  // Yeni ürün ekle
  addProduct(product: CreateProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${this.apiUrl}/AddProduct`, product);
  }

  // Mevcut bir ürünü güncelle
  updateProduct(productId: number, product: UpdateProductModel): Observable<ProductModel> {
    return this.http.put<ProductModel>(`${this.apiUrl}/UpdateProduct/${productId}`, product);
  }

  // Ürünü ID'ye göre sil
  deleteProduct(productId: number): Observable<string> {
    return this.http.delete<string>(`${this.apiUrl}/DeleteProduct/${productId}`);
  }
}
