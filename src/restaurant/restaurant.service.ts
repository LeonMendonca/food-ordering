import { Injectable } from '@nestjs/common';
import { Restaurant, Menu, Dish, Country } from '../graphql';
import { PrismaService } from 'src/prisma.service';
import { AccessContextService } from 'src/access-context.service';

@Injectable()
export class RestaurantService {
  constructor(
    private prisma: PrismaService,
    private accessContext: AccessContextService
  ) {
  }

  async findAll(): Promise<Restaurant[]> {
    const country = this.accessContext.country;
    return this.prisma.restaurant.findMany({
      where: country ? { country } : {},
      include: { menus: { include: { dishes: true, } } }
    }) as any;
  }

  async findOne(id: string): Promise<Restaurant | null> {
    const country = this.accessContext.country;
    return this.prisma.restaurant.findFirst({
      where: country ? { id, country } : { id },
      include: { menus: { include: { dishes: true, } } }
    }) as any;
  }

}
