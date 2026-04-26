import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { AddPaymentMethodInput } from '../graphql';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from '@prisma/client';

@Resolver('Payment')
@UseGuards(RolesGuard)
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) { }

  @Query('paymentMethods')
  @Roles(Role.ADMIN, Role.MANAGER)
  async getPaymentMethods() {
    return this.paymentService.findAllMethods();
  }

  @Query('payments')
  @Roles(Role.ADMIN, Role.MANAGER)
  async getPayments() {
    return this.paymentService.findAllPayments();
  }

  @Mutation('addPaymentMethod')
  @Roles(Role.ADMIN, Role.MANAGER)
  async addPaymentMethod(
    @Args('userId') userId: string,
    @Args('input') input: AddPaymentMethodInput,
  ) {
    return this.paymentService.addPaymentMethod(userId, input);
  }

  @Mutation('checkout')
  @Roles(Role.ADMIN, Role.MANAGER)
  async checkout(
    @Args('orderId') orderId: string,
    @Args('paymentMethodId') paymentMethodId: string,
  ) {
    return this.paymentService.checkout(orderId, paymentMethodId);
  }

  @Mutation('updatePaymentMethod')
  @Roles(Role.ADMIN)
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('input') input: AddPaymentMethodInput,
  ) {
    return this.paymentService.updatePaymentMethod(id, input);
  }
}
