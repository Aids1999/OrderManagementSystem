export type Role = 'customer' | 'executor';
export type OrderStatus = 'new' | 'in_progress' | 'completed';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface Order {
  id: number;
  title: string;
  description: string;
  deadline: string;
  price: number;
  status: OrderStatus;
  customerId: number;
  executorId: number | null;
}

export type OrderForm = Pick<Order, 'title' | 'description' | 'deadline' | 'price'>;
