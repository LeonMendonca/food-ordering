import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { User, Country, Role } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  private readonly userInclude = {
    orders: true,
    paymentMethods: true,
  };

  async findAll(country?: Country, role?: Role): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        country: country || undefined,
        role: role || undefined,
      },
      include: this.userInclude,
    });
  }

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id },
      include: this.userInclude,
    });
  }

  async getDistinctCountries(): Promise<Country[]> {
    const result = await this.prisma.user.findMany({
      distinct: ['country'],
      select: {
        country: true,
      },
    });

    return result.map((r) => r.country);
  }

  async getDistinctRoles(): Promise<Role[]> {
    const result = await this.prisma.user.findMany({
      distinct: ['role'],
      select: {
        role: true,
      },
    });

    return result.map((r) => r.role);
  }
}
