import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CategoryModel, CreateCategoryModel, UpdateCategoryModel } from 'src/app/model/category/category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = 'https://localhost:7263/api/category'; // API URL'si

  constructor(private http: HttpClient) {}

  // Tüm kategorileri getir
  getCategories(): Observable<CategoryModel[]> {
    return this.http.get<CategoryModel[]>(`${this.apiUrl}/GetCategories`);
  }

  // Yeni kategori ekle
  addCategory(category: CreateCategoryModel): Observable<CategoryModel> {
    return this.http.post<CategoryModel>(`${this.apiUrl}/AddCategory`, category);
  }

  // Mevcut bir kategoriyi güncelle
  updateCategory(categoryID: number, category: UpdateCategoryModel): Observable<CategoryModel> {
    return this.http.put<CategoryModel>(`${this.apiUrl}/UpdateCategory/${categoryID}`, category);
  }

  // Kategoriyi sil
  deleteCategory(categoryID: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/DeleteCategory/${categoryID}`);
  }
}
