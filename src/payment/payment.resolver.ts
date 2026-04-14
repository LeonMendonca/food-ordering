import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { AddPaymentMethodInput } from '../graphql';

@Resolver('Payment')
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation('addPaymentMethod')
  async addPaymentMethod(
    @Args('userId') userId: string,
    @Args('input') input: AddPaymentMethodInput,
  ) {
    return this.paymentService.addPaymentMethod(userId, input);
  }

  @Mutation('checkout')
  async checkout(
    @Args('orderId') orderId: string,
    @Args('paymentMethodId') paymentMethodId: string,
  ) {
    return this.paymentService.checkout(orderId, paymentMethodId);
  }

  @Mutation('updatePaymentMethod')
  async updatePaymentMethod(
    @Args('id') id: string,
    @Args('input') input: AddPaymentMethodInput,
  ) {
    return this.paymentService.updatePaymentMethod(id, input);
  }
}
