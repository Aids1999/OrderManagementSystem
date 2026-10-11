import { Order } from '../domain/order.js';
import { User } from '../domain/user.js';
import { OrderDto, UserDto } from './dto.js';

export function toUserDto(user: User): UserDto {
  return { id: user.id, name: user.name, email: user.email, role: user.role };
}

export function toOrderDto(order: Order): OrderDto {
  return {
    id: order.id,
    title: order.title,
    description: order.description,
    deadline: order.deadline,
    price: order.price,
    status: order.status,
    customerId: order.customerId,
    executorId: order.executorId
  };
}
