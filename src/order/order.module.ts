import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderResolver } from './order.resolver';
import { AccessContextService } from 'src/access-context.service';

@Module({
  providers: [OrderService, OrderResolver, AccessContextService],
  exports: [OrderService],
})
export class OrderModule { }
