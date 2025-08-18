import { AuthService } from './auth';
import { CustomerService } from './customer';
import { OrderService } from './order';

export const authService = new AuthService();
export const customerService = new CustomerService();
export const orderService = new OrderService();
