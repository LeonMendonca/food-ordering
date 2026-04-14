import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AccessContextService } from './access-context.service';
import { PrismaService } from './prisma.service';

@Injectable()
export class AccessContextMiddleware implements NestMiddleware {
  constructor(
    private readonly prisma: PrismaService,
    private readonly accessContext: AccessContextService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const userId = req.headers['x-user-id'] as string;

    if (userId) {
      try {
        // Query directly using the raw prisma client to avoid extensions (which aren't built yet)
        const user = await this.prisma.user.findUnique({
          where: { id: userId },
        });

        if (user) {
          this.accessContext.setContext(user.id, user.country);
        }
      } catch (error) {
        console.error('Error fetching user context:', error);
      }
    }

    next();
  }
}
