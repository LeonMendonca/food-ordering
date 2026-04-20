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
    return this.prisma.restaurant.findMany({
      where: this.accessContext.getScopeFilter(),
      include: { menus: { include: { dishes: true, } } }
    }) as any;
  }

  async findOne(id: string): Promise<Restaurant | null> {
    return this.prisma.restaurant.findFirst({
      where: this.accessContext.getScopeFilter({ id }),
      include: { menus: { include: { dishes: true, } } }
    }) as any;
  }

}
