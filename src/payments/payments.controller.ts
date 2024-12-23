import { Controller, Get, Post } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}
  @Post('create-payment-session')
  createrPaymentSession() {
    return this.paymentsService.createPaymentSession();
  }
  @Get('success')
  success() {
    return {
      ok: true,
      message: 'Payment was successful',
    };
  }

  @Get('cancel')
  cancel() {
    return {
      ok: true,
      message: 'Payment was canceled',
    };
  }

  @Post('webhook')
  async stripeWebhook() {
    return {
      ok: true,
      message: 'Webhook received',
    };
  }
}
