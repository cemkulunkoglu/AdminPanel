import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product/product.service';
import { CategoryService } from '../../services/category/category.service';
import { ProductModel } from 'src/app/model/product/product.model';
import { CreateProductModel } from 'src/app/model/product/create-product.model';
import { UpdateProductModel } from 'src/app/model/product/update-product.model';
import { CategoryModel } from 'src/app/model/category/category.model';

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
  selectedCategoryId: number = 0;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService
  ) {}

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
    this.filteredProducts = this.products.filter(product =>
      (this.selectedCategoryId === 0 || product.categoryID === this.selectedCategoryId) &&
      (`${product.productName} ${product.barcode}`.toLowerCase().includes(term))
    );
  }

  onCategoryChange(): void {
    this.filterProducts();
  }

  onSearchTermChange(): void {
    this.filterProducts();
  }

  addProduct(): void {
    this.productService.addProduct(this.newProduct).subscribe(
      (product) => {
        this.products.push(product);
        this.filterProducts();
        this.newProduct = { productName: '', unitPrice: 0, barcode: '', categoryID: 0 };
      },
      (error) => {
        console.error('Ürün eklenirken hata oluştu:', error);
      }
    );
  }

  openUpdateModal(product: ProductModel): void {
    this.selectedProduct = { ...product };
  }

  updateProduct(): void {
    if (this.selectedProduct) {
      this.productService.updateProduct(this.selectedProduct.productID, this.selectedProduct).subscribe(
        (updatedProduct) => {
          const index = this.products.findIndex(p => p.productID === updatedProduct.productID);
          if (index !== -1) {
            this.products[index] = updatedProduct;
          }
          this.filterProducts();
          this.selectedProduct = null;
        },
        (error) => {
          console.error('Ürün güncellenirken hata oluştu:', error);
        }
      );
    }
  }

  confirmDelete(product: ProductModel): void {
    if (confirm(`${product.productName} adlı ürünü silmek istediğinize emin misiniz?`)) {
      this.productService.deleteProduct(product.productID).subscribe(
        () => {
          this.products = this.products.filter(p => p.productID !== product.productID);
          this.filterProducts();
        },
        (error) => {
          console.error('Ürün silinirken hata oluştu:', error);
        }
      );
    }
  }
}
