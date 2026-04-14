import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddPaymentMethodInput } from '../graphql';
import { AccessContextService } from 'src/access-context.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private accessContext: AccessContextService
  ) {}

  async addPaymentMethod(userId: string, input: AddPaymentMethodInput) {
    const country = this.accessContext.country;

    // Verify user belongs to the current country context
    if (country) {
      const user = await this.prisma.user.findFirst({
        where: { id: userId, country: country as any }
      });
      if (!user) {
        throw new Error('User not found or access denied');
      }
    }

    // Extract last 4 digits if card number is provided
    const last4 = input.cardNumber ? input.cardNumber.slice(-4) : null;

    return this.prisma.paymentMethod.create({
      data: {
        userId,
        type: input.type,
        provider: input.provider,
        last4,
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
      },
    });
  }

  async updatePaymentMethod(id: string, input: AddPaymentMethodInput) {
    const country = this.accessContext.country;

    // Verify ownership and country context
    if (country) {
      const method = await this.prisma.paymentMethod.findFirst({
        where: { id, user: { country: country as any } }
      });
      if (!method) {
        throw new Error('Payment method not found or access denied');
      }
    }

    const last4 = input.cardNumber ? input.cardNumber.slice(-4) : undefined;

    return this.prisma.paymentMethod.update({
      where: { id },
      data: {
        type: input.type,
        provider: input.provider,
        last4,
        expiryMonth: input.expiryMonth,
        expiryYear: input.expiryYear,
      },
    });
  }

  async checkout(orderId: string, paymentMethodId: string) {
    const country = this.accessContext.country;

    // Run in a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // 1. Get the order with country restriction
      const order = await tx.order.findFirst({
        where: country ? { id: orderId, country: country as any } : { id: orderId },
      });

      if (!order) {
        throw new Error('Order not found or access denied');
      }

      if (order.status !== 'PENDING') {
        throw new Error(`Order cannot be checked out with status: ${order.status}`);
      }

      // 2. Create the payment record
      const payment = await tx.payment.create({
        data: {
          orderId,
          paymentMethodId,
          amount: order.totalPrice,
          status: 'SUCCESS', // Mocking immediate success
        },
        include: {
          order: {
            include: {
                customer: true,
                items: {
                    include: {
                        dish: true
                    }
                }
            }
          },
          method: true,
        },
      });

      // 3. Update the order status
      await tx.order.update({
        where: { id: orderId },
        data: { status: 'CONFIRMED' },
      });

      return payment;
    });
  }
}
