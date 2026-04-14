import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, CreateOrderInput, OrderStatus, Country, Role } from '../graphql';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) { }

  @Mutation('createOrder')
  async createOrder(@Args('input') input: CreateOrderInput) {
    return this.orderService.create(input)
  }

  @Mutation('cancelOrder')
  async cancelOrder(@Args('orderId') orderId: string) {
    return this.orderService.cancel(orderId)
  }
}
