import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';

const makePaymentIntent = asyncHandler(async (req, res) => {
    const key = process.env.STRIPE_SECRET_KEY;
  const stripe = new Stripe(key);
  const { amount, orderId, currency } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: currency || 'lkr',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId || 'no_order_id',
      },
    });

    res.status(200).json({
      success:'true',
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id, 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export { makePaymentIntent };
