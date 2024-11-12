import { Component, OnInit } from '@angular/core';
import { CategoryService } from '../../services/category/category.service';
import { CategoryModel, CreateCategoryModel, UpdateCategoryModel } from 'src/app/model/category/category.model';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: CategoryModel[] = [];
  newCategory: CreateCategoryModel = { categoryName: '' };
  selectedCategory: UpdateCategoryModel | null = null;
  searchTerm: string = '';
  filteredCategories: CategoryModel[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
        this.filteredCategories = data;
      },
      (error) => {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    );
  }

  searchCategory(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredCategories = this.categories.filter(category =>
      category.categoryName.toLowerCase().includes(term)
    );
  }

  addCategory(): void {
    this.categoryService.addCategory(this.newCategory).subscribe(
      (category) => {
        this.categories.push(category);
        this.filteredCategories.push(category);
        this.newCategory = { categoryName: '' };
        Swal.fire('Başarılı!', 'Kategori başarıyla eklendi.', 'success');
        const closeModalButton = document.querySelector('#addCategoryModal .btn-close') as HTMLElement;
        closeModalButton.click();
        location.reload();
      },
      (error) => {
        Swal.fire('Hata!', 'Kategori eklenirken bir hata oluştu.', 'error');
      }
    );
  }

  openUpdateModal(category: CategoryModel): void {
    this.selectedCategory = { ...category };
  }

  updateCategory(): void {
    if (this.selectedCategory) {
      this.categoryService.updateCategory(this.selectedCategory.categoryID, this.selectedCategory).subscribe(
        (updatedCategory) => {
          const index = this.categories.findIndex(c => c.categoryID === updatedCategory.categoryID);
          if (index !== -1) {
            this.categories[index] = updatedCategory;
          }
          this.filteredCategories = this.categories;
          this.selectedCategory = null;
          Swal.fire('Başarılı!', 'Kategori başarıyla güncellendi.', 'success');
          const closeModalButton = document.querySelector('#updateCategoryModal .btn-close') as HTMLElement;
          closeModalButton.click();
        },
        (error) => {
          Swal.fire('Hata!', 'Kategori güncellenirken bir hata oluştu.', 'error');
        }
      );
    }
  }

  confirmDelete(category: CategoryModel): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${category.categoryName} adlı kategoriyi silmek istediğinizden emin misiniz?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Evet, sil!',
      cancelButtonText: 'Hayır, iptal et',
      customClass: {
        confirmButton: 'btn btn-danger btn-sm',
        cancelButton: 'btn btn-secondary btn-sm'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        this.categoryService.deleteCategory(category.categoryID).subscribe(
          () => {
            this.categories = this.categories.filter(c => c.categoryID !== category.categoryID);
            this.filteredCategories = this.categories;
            Swal.fire('Hata!', 'Kategori silinirken bir hata oluştu.', 'error');
          },
          (error) => {
            Swal.fire('Başarılı!', 'Kategori başarıyla silindi.', 'success').then(() => {
              location.reload();
            });
          }
        );
      }
    });
  }
}
