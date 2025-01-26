import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/env';
import Stripe from 'stripe';
import { PaymentSessionDto } from './dto/payment-session.dto';
import { Request, Response } from 'express';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET);

  async createPaymentSession(paymentSessionDto: PaymentSessionDto) {
    const { currency, items, orderId } = paymentSessionDto;
    const lineItems = items.map((item) => ({
      price_data: {
        currency,
        product_data: {
          name: item.name,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    }));
    const session = await this.stripe.checkout.sessions.create({
      payment_intent_data: {
        metadata: {
          orderId,
        },
      },
      line_items: lineItems,
      mode: 'payment',
      success_url: envs.STRIPE_SUCCESS_URL,
      cancel_url: envs.STRIPE_CANCEL_URL,
    });
    return session;
  }
  async stripeWebHoolk(req: Request, res: Response) {
    // const endpointSecret =
    // 'whsec_96dc94c7eecffb07649d3f5bcce93cc7869ba3adc238222282a609cb399855d6';
    const endpointSecret = envs.STRIPE_ENDPOINTSECRET;
    const sig = req.headers['stripe-signature'];
    let event: Stripe.Event;

    console.log({ sig });
    try {
      event = this.stripe.webhooks.constructEvent(
        req['rawBody'],
        sig,
        endpointSecret,
      );
    } catch (error) {
      res.status(400).send(`Webhook Error: ${error.message}`);
      return;
    }
    console.log({ event });
    switch (event.type) {
      case 'charge.succeeded':
        const chargeSuceded = event.data.object;
        console.log({
          metadata: chargeSuceded.metadata,
        });
        break;
      default:
        console.log(`Event ${event.type} not handled`);
    }

    return res.status(200).json({ sig });
  }
}
