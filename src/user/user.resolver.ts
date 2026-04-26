import { Resolver, Query, Args } from '@nestjs/graphql';
import { UserService } from './user.service';
import { Country, Role } from '@prisma/client';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Resolver('User')
//@UseGuards(RolesGuard)
export class UserResolver {
  constructor(private readonly userService: UserService) { }

  @Query('users')
  //@Roles(Role.ADMIN, Role.MANAGER)
  async getUsers(
    @Args('country') country?: Country,
    @Args('role') role?: Role,
  ) {
    return this.userService.findAll(country, role);
  }

  @Query('user')
  //@Roles(Role.ADMIN, Role.MANAGER)
  async getUser(@Args('id') id: string) {
    return this.userService.findOne(id);
  }

  @Query('distinctCountries')
  //@Roles(Role.ADMIN, Role.MANAGER)
  async getDistinctCountries() {
    return this.userService.getDistinctCountries();
  }

  @Query('distinctRoles')
  //@Roles(Role.ADMIN, Role.MANAGER)
  async getDistinctRoles() {
    return this.userService.getDistinctRoles();
  }
}
