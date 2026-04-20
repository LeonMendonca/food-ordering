import { Injectable, ForbiddenException } from '@nestjs/common';
import { CreateOrderInput, Order } from 'src/graphql';
import { PrismaService } from 'src/prisma.service';
import { AccessContextService } from 'src/access-context.service';

@Injectable()
export class OrderService {
    constructor(
        private prisma: PrismaService,
        private accessContext: AccessContextService
    ) { }

    async create(input: CreateOrderInput): Promise<Order> {
        // Only ADMIN and MANAGER can place orders
        if (!this.accessContext.hasAnyRole(['ADMIN', 'MANAGER'])) {
            throw new ForbiddenException('Only managers and admins can place orders');
        }

        // Enforce country scope for creation
        const country = this.accessContext.getScopeFilter({ country: input.country }).country as any;
        
        return this.prisma.order.create({
            data: {
                customerId: input.customerId,
                totalPrice: input.totalPrice,
                deliveryAddress: input.deliveryAddress,
                country: country as any,
                items: {
                    create: input.items.map(item => ({
                        dishId: item.dishId,
                        quantity: item.quantity,
                        price: item.price,
                    })),
                },
            },
            include: {
                customer: true,
                items: {
                    include: {
                        dish: true,
                    },
                },
            },
        }) as any;
    }

    async cancel(id: string) {
        // Verify the order exists within scope
        const order = await this.prisma.order.findFirst({
            where: this.accessContext.getScopeFilter({ id })
        });

        if (!order) {
            throw new Error('Order not found or access denied');
        }

        return this.prisma.order.update({
            where: { id },
            data: { status: 'CANCELLED' },
            include: {
                customer: true,
                items: {
                    include: {
                        dish: true,
                    },
                },
            },
        }) as any;
    }
}
