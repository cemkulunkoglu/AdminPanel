import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../services/order/order.service';
import { OrderStatusService } from '../../services/orderstatus/orderstatus.service';
import Swal from 'sweetalert2';
import { OrderModel } from 'src/app/model/order/order.model';
import { OrderStatusModel } from 'src/app/model/orderstatus/orderstatus.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderModel[] = [];
  filteredOrders: OrderModel[] = [];
  searchTerm: string = '';
  selectedOrder: OrderModel | null = null;
  orderStatuses: OrderStatusModel[] = [];

  @ViewChild('updateStatusModal') updateStatusModal!: ElementRef;

  constructor(
    private orderService: OrderService,
    private orderStatusService: OrderStatusService
  ) {}

  ngOnInit(): void {
    this.loadOrders();
    this.loadOrderStatuses();
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data) => {
        this.orders = data.filter((order, index, self) =>
          index === self.findIndex((o) => o.orderNumber === order.orderNumber)
        );
        this.filteredOrders = this.orders;
      },
      (error) => {
        console.error('Siparişler yüklenirken hata oluştu:', error);
      }
    );
  }

  loadOrderStatuses(): void {
    this.orderStatusService.getOrderStatuses().subscribe(
      (statuses) => {
        this.orderStatuses = statuses;
      },
      (error) => {
        console.error('Sipariş durumları yüklenirken hata oluştu:', error);
      }
    );
  }

  searchOrder(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredOrders = this.orders.filter(order =>
      `${order.orderNumber} ${order.customer.firstName} ${order.customer.lastName}`
        .toLowerCase()
        .includes(term)
    );
  }

  openUpdateStatusModal(order: OrderModel): void {
    this.selectedOrder = { ...order };
    const modalElement = this.updateStatusModal.nativeElement as HTMLElement;
    modalElement.style.display = 'block';
    modalElement.classList.add('show');
  }

  closeModal(): void {
    const modalElement = this.updateStatusModal.nativeElement as HTMLElement;
    modalElement.style.display = 'none';
    modalElement.classList.remove('show');
    this.selectedOrder = null;
  }

  updateOrderStatus(): void {
    if (this.selectedOrder) {
      this.orderService.updateOrder(this.selectedOrder.orderNumber, { statusID: this.selectedOrder.statusID }).subscribe(
        () => {
          Swal.fire('Hata!', 'Sipariş durumu güncellenirken bir hata oluştu.', 'error');
        },
        (error) => {
          Swal.fire('Başarılı!', 'Sipariş durumu başarıyla güncellendi.', 'success');
          this.loadOrders();
          this.closeModal();
        }
      );
    }
  }
}
