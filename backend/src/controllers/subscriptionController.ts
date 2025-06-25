import { Request, Response } from 'express';
import Stripe from 'stripe';
import User from '../models/User';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET as string;

export const createCheckoutSession = async (req: Request, res: Response) => {
  const { priceId } = req.body;
  const userId = (req.user as any)?.id;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  let stripeCustomerId = user.stripeCustomerId;
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: { userId: user.id.toString() },
    });
    stripeCustomerId = customer.id;
    await User.findByIdAndUpdate(user.id, { stripeCustomerId });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'subscription',
    customer: stripeCustomerId,
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: `${process.env.FRONTEND}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.FRONTEND}/dashboard/subscription?canceled=1`,
  });

  res.json({ url: session.url });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];

  if (!sig) {
    return res.status(400).json({ message: 'No Stripe signature found' });
  }

  const event = stripe.webhooks.constructEvent(
    req.body,
    sig,
    STRIPE_WEBHOOK_SECRET
  );

  // Handle the event
  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription;
      const { customer, status, items } = subscription;
      const priceId = items.data[0].price.id;

      // Map price ID to plan name
      const planMap: { [key: string]: string } = {
        [process.env.STRIPE_BASIC_PRICE_ID as string]: 'Basic',
        [process.env.STRIPE_PREMIUM_PRICE_ID as string]: 'Premium',
      };

      // Find user by Stripe customer ID and update subscription
      const updatedUser = await User.findOneAndUpdate(
        { stripeCustomerId: customer },
        {
          subscriptionStatus: status === 'active' || status === 'trialing' ? 'active' : status,
          subscriptionPlan: planMap[priceId] || 'Unknown',
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error(`No user found for Stripe customer: ${customer}`);
      } else {
        console.log(`Updated subscription for user ${updatedUser.email} to ${status} - ${planMap[priceId]}`);
      }
      break;
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription;

      const updatedUser = await User.findOneAndUpdate(
        { stripeCustomerId: subscription.customer },
        {
          subscriptionStatus: 'inactive',
          subscriptionPlan: 'Free',
        },
        { new: true }
      );

      if (!updatedUser) {
        console.error(`No user found for Stripe customer: ${subscription.customer}`);
      } else {
        console.log(`Subscription cancelled for user ${updatedUser.email}`);
      }
      break;
    }

    case 'invoice.payment_failed': {
      const invoice = event.data.object as Stripe.Invoice;

      const updatedUser = await User.findOneAndUpdate(
        { stripeCustomerId: invoice.customer },
        { subscriptionStatus: 'past_due' },
        { new: true }
      );

      if (!updatedUser) {
        console.error(`No user found for Stripe customer: ${invoice.customer}`);
      } else {
        console.log(`Payment failed for user ${updatedUser.email}`);
      }
      break;
    }

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }
  res.json({ received: true });
};

export const createPortalSession = async (req: Request, res: Response) => {
  const userId = (req.user as any)?.id;
  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const user = await User.findById(userId);
  if (!user || !user.stripeCustomerId) {
    return res.status(401).json({ message: 'Unauthorized or no customer ID found' });
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: user.stripeCustomerId,
    return_url: `${process.env.FRONTEND}/dashboard/subscription?refresh=true`,
  });

  res.json({ url: portalSession.url });
}; 