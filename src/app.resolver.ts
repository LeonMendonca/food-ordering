import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class AppResolver {
  @Query('restaurants')
  getRestaurants() {
    return [];
  }
}
