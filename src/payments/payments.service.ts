import { Injectable } from '@nestjs/common';
import { envs } from 'src/config/env';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET);
}
