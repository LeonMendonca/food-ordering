import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { AddPaymentMethodInput } from '../graphql';
import { AccessContextService } from 'src/access-context.service';

@Injectable()
export class PaymentService {
  constructor(
    private prisma: PrismaService,
    private accessContext: AccessContextService
  ) { }

  async addPaymentMethod(userId: string, input: AddPaymentMethodInput) {
    // Verify user belongs to the current scope
    const user = await this.prisma.user.findFirst({
      where: this.accessContext.getScopeFilter({ id: userId }),
    });
    if (!user) {
      throw new Error('User not found or access denied');
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
    // Verify ownership and country context
    const method = await this.prisma.paymentMethod.findFirst({
      where: {
        id,
        user: this.accessContext.getScopeFilter(),
      },
    });
    if (!method) {
      throw new Error('Payment method not found or access denied');
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

  async findAllMethods() {
    return this.prisma.paymentMethod.findMany({
      where: {
        user: this.accessContext.getScopeFilter(),
      },
      include: {
        user: true,
      },
    });
  }

  async findAllPayments() {
    return this.prisma.payment.findMany({
      where: {
        order: this.accessContext.getScopeFilter(),
      },
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: {
                dish: true,
              },
            },
          },
        },
        method: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async checkout(orderId: string, paymentMethodId: string) {
    // Run in a transaction to ensure atomicity
    return this.prisma.$transaction(async (tx) => {
      // 1. Get the order within scope
      const order = await tx.order.findFirst({
        where: this.accessContext.getScopeFilter({ id: orderId }),
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
          status: 'SUCCESS',
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
