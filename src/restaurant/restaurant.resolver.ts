import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { RestaurantService } from './restaurant.service';
import { Restaurant, Menu, Dish } from '../graphql';

@Resolver('Restaurant')
export class RestaurantResolver {
  constructor(private readonly restaurantService: RestaurantService) { }

  @Query('restaurants')
  async getRestaurants() {
    return this.restaurantService.findAll();
  }

  @Query('restaurant')
  async getRestaurant(@Args('id') id: string) {
    return this.restaurantService.findOne(id);
  }
}

@Resolver('Menu')
export class MenuResolver {
  @ResolveField('dishes')
  async getMenuDishes(@Parent() menu: Menu): Promise<Dish[]> {
    return menu.dishes;
  }
}

@Resolver('Dish')
export class DishResolver {
  @ResolveField('menu')
  async getDishMenu(@Parent() dish: Dish): Promise<Menu> {
    return dish.menu;
  }
}
