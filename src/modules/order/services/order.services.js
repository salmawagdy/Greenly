import Order from "../../../DB/model/order.model.js";

import { Stripe } from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createOrder = async (req, res) => {
  try {
    const { products, amount } = req.body;

    // Step 1: Create PaymentIntent in Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Stripe requires amount in cents
      currency: 'usd',
      payment_method_types: ['card'],
    });

    // Step 2: Create order in the database
    const order = await Order.create({
      userId: req.user._id,  // Make sure you are using authentication middleware
      products,
      amount,
      currency: 'usd',
      paymentIntentId: paymentIntent.id,
    });

    // Step 3: Return clientSecret to frontend
    res.status(201).json({
      message: 'Order created successfully',
      order,
      clientSecret: paymentIntent.client_secret, // This will be used in the frontend to complete payment
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};