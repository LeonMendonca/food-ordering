import { Module } from '@nestjs/common';
import { RestaurantService } from './restaurant.service';
import { RestaurantResolver, MenuResolver, DishResolver } from './restaurant.resolver';
import { AccessContextService } from 'src/access-context.service';

@Module({
  providers: [RestaurantService, RestaurantResolver, MenuResolver, DishResolver, AccessContextService],
  exports: [RestaurantService],
})
export class RestaurantModule { }
