import { CustomerModel } from "../customer/customer.model";
import { ProductModel } from "../product/product.model";

export interface OrderModel {
  orderID: number;
  orderDate: Date;
  orderAmount: number;
  orderTotalAmount: number;
  orderNumber: string;
  statusID: number;
  statusName: string;
  customer: CustomerModel;
  quantity: number;
  products: ProductModel[];
}
