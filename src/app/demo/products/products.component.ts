import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { ProductModel } from 'src/app/model/product/product.model';
import { CreateProductModel } from 'src/app/model/product/create-product.model';
import { UpdateProductModel } from 'src/app/model/product/update-product.model';
import { CategoryModel } from 'src/app/model/category/category.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products: ProductModel[] = [];
  filteredProducts: ProductModel[] = [];
  categories: CategoryModel[] = [];
  searchTerm: string = '';
  newProduct: CreateProductModel = { productName: '', unitPrice: 0, barcode: '', categoryID: 0 };
  selectedProduct: UpdateProductModel | null = null;
  selectedCategoryName: string = 'Tüm Kategoriler';

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.productService.getProducts().subscribe(
      (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      (error) => {
        console.error('Ürünler yüklenirken hata oluştu:', error);
      }
    );
  }

  loadCategories(): void {
    this.categoryService.getCategories().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Kategoriler yüklenirken hata oluştu:', error);
      }
    );
  }

  getCategoryName(categoryID: number): string {
    const category = this.categories.find(c => c.categoryID === categoryID);
    return category ? category.categoryName : 'Bilinmeyen Kategori';
  }

  filterProducts(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredProducts = this.products.filter(product => {
      const productCategoryName = this.getCategoryName(product.categoryID);
      return (this.selectedCategoryName === 'Tüm Kategoriler' || productCategoryName === this.selectedCategoryName) &&
        (`${product.productName} ${product.barcode}`.toLowerCase().includes(term));
    });
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  onSearchTermChange(): void {
    this.filterProducts();
  }

  addProduct(): void {
    this.newProduct.categoryID = Number(this.newProduct.categoryID);
    this.productService.addProduct(this.newProduct).subscribe(
      (product) => {
        this.products.push(product);
        this.filterProducts();
        this.newProduct = { productName: '', unitPrice: 0, barcode: '', categoryID: 0 };
        Swal.fire('Başarılı!', 'Ürün başarıyla eklendi.', 'success');
        const closeModalButton = document.querySelector('#addProductModal .btn-close') as HTMLElement;
        closeModalButton.click();
        location.reload();
      },
      (error) => {
        Swal.fire('Hata!', 'Ürün eklenirken bir hata oluştu.', 'error');
      }
    );
  }

  openUpdateModal(product: ProductModel): void {
    this.selectedProduct = { ...product };
  }

  updateProduct(): void {
    if (this.selectedProduct) {
      this.selectedProduct.categoryID = Number(this.selectedProduct.categoryID);

      this.productService.updateProduct(this.selectedProduct).subscribe(
        (updatedProduct) => {
          const index = this.products.findIndex(p => p.productID === updatedProduct.productID);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.filterProducts();
          this.selectedProduct = null;
          Swal.fire('Başarılı!', 'Ürün başarıyla güncellendi.', 'success');
          const closeModalButton = document.querySelector('#updateProductModal .btn-close') as HTMLElement;
          closeModalButton.click();
        },
        (error) => {
          Swal.fire('Hata!', 'Ürün güncellenirken bir hata oluştu.', 'error');
        }
      );
    }
  }

  confirmDelete(product: ProductModel): void {
    Swal.fire({
      title: 'Emin misiniz?',
      text: `${product.productName} adlı ürünü silmek istediğinizden emin misiniz?`,
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
        this.productService.deleteProduct(product.productID).subscribe(
          () => {
            this.products = this.products.filter(p => p.productID !== product.productID);
            this.filterProducts();
            Swal.fire('Hata!', 'Ürün silinirken bir hata oluştu.', 'error');
          },
          (error) => {
            Swal.fire('Başarılı!', 'Ürün başarıyla silindi.', 'success').then(() => {
              location.reload();
            });
          }
        );
      }
    });
  }
}
