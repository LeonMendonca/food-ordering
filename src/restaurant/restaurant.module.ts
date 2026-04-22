import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantResolver, MenuResolver, DishResolver } from './restaurant.resolver';

@Module({
  providers: [RestaurantService, RestaurantResolver, MenuResolver, DishResolver],
  exports: [RestaurantService],
})
export class RestaurantModule { }
