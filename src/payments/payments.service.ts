import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/env';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET);

  async createPaymentSession() {
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {},
      },
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'T-shirt',
            },
            unit_amount: 2000,
          },
          quantity: 2,
        },
      ],
      mode: 'payment',
      success_url: `http://localhost:${envs.PORT}/api/payments/success`,
      cancel_url: `http://localhost:${envs.PORT}/api/payments/cancel`,
    });
    return session;
  }
}
