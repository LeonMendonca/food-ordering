import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { AccessContextService } from 'src/access-context.service';

@Module({
  providers: [PaymentService, PaymentResolver, AccessContextService],
  exports: [PaymentService],
})
export class PaymentModule { }
