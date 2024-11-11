import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer/customer.service';
import { CustomerModel } from 'src/app/model/customer/customer.model';
import { CreateCustomerModel } from 'src/app/model/customer/create-customer.model';
import { UpdateCustomerModel } from 'src/app/model/customer/update-customer.model';
import { Toast } from 'bootstrap';
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-customer',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.scss'],
  standalone: true,
  imports: [SharedModule]
})
export class CustomersComponent implements OnInit {
  customers: CustomerModel[] = [];
  newCustomer: CreateCustomerModel = { firstName: '', lastName: '', email: '', phoneNumber: '' };
  selectedCustomer: UpdateCustomerModel | null = null;

  constructor(private customerService: CustomerService) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.customerService.getCustomers().subscribe(
      (data) => {
        console.log('API yanıtı:', data);
        this.customers = data;
      },
      (error) => {
        console.error('API çağrısında hata oluştu:', error);
      }
    );
  }
  

  showToast(message: string, title: string = 'Notification') {
    const toastTitle = document.getElementById('toastTitle')!;
    const toastMessage = document.getElementById('toastMessage')!;
    toastTitle.innerText = title;
    toastMessage.innerText = message;

    const toastElement = document.getElementById('operationToast');
    const toast = new Toast(toastElement!);
    toast.show();
  }

  addCustomer(): void {
    this.customerService.addCustomer(this.newCustomer).subscribe(
      (customer) => {
        this.customers.push(customer);
        this.newCustomer = { firstName: '', lastName: '', email: '', phoneNumber: '' };
        this.showToast('Müşteri başarıyla eklendi.', 'Başarılı');
        const closeModalButton = document.querySelector('#addCustomerModal .btn-close') as HTMLElement;
        closeModalButton.click();
      },
      (error) => {
        this.showToast('Müşteri eklenirken hata oluştu.', 'Hata');
      }
    );
  }

  updateCustomer(): void {
    if (this.selectedCustomer) {
      this.customerService.updateCustomer(this.selectedCustomer.customerID, this.selectedCustomer).subscribe(
        (updatedCustomer) => {
          const index = this.customers.findIndex(c => c.customerID === updatedCustomer.customerID);
          if (index !== -1) {
            this.customers[index] = updatedCustomer;
          }
          this.showToast('Müşteri başarıyla güncellendi.', 'Başarılı');
          this.selectedCustomer = null;
        },
        (error) => {
          this.showToast('Müşteri güncellenirken hata oluştu.', 'Hata');
        }
      );
    }
  }

  deleteCustomer(customerId: number): void {
    this.customerService.deleteCustomer(customerId).subscribe(
      () => {
        this.customers = this.customers.filter(c => c.customerID !== customerId);
        this.showToast('Müşteri başarıyla silindi.', 'Başarılı');
      },
      (error) => {
        this.showToast('Müşteri silinirken hata oluştu.', 'Hata');
      }
    );
  }

  openUpdateModal(customer: CustomerModel): void {
    this.selectedCustomer = { ...customer };
  }
}
