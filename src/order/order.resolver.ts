import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { OrderService } from './order.service';
import { Order, CreateOrderInput, OrderStatus, Country } from '../graphql';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Resolver()
@UseGuards(RolesGuard)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) { }

  @Mutation('createOrder')
  async createOrder(@Args('input') input: CreateOrderInput) {
    return this.orderService.create(input)
  }

  @Mutation('cancelOrder')
  @Roles(Role.ADMIN, Role.MANAGER)
  async cancelOrder(@Args('orderId') orderId: string) {
    return this.orderService.cancel(orderId)
  }
}
