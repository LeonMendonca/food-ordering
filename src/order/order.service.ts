import { Injectable } from '@nestjs/common';
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
        const country = this.accessContext.country || input.country;
        
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
        const country = this.accessContext.country;

        // Verify the order exists in the user's country
        const order = await this.prisma.order.findFirst({
            where: country ? { id, country: country as any } : { id }
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
