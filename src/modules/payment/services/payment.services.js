import Stripe from "stripe";
import Cart from "../../../DB/model/cartShopping.model.js";
import Order from "../../../DB/model/order.model.js";
const stripe = new Stripe("");

export const createStripeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user._id,
      status: "active",
    }).populate("products.productId");
    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(cart.totalPrice * 100), // in cents
      currency: "usd",
      metadata: { userId: req.user._id.toString() },
    });

    // Create Order in DB (pending)
    const order = await Order.create({
      userId: req.user._id,
      products: cart.products,
      amount: cart.totalPrice,
      status: "pending",
      stripePaymentIntentId: paymentIntent.id,
    });

    res.status(200).json({
      message: "Stripe payment initiated",
      clientSecret: paymentIntent.client_secret,
      orderId: order._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const stripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const order = await Order.findOne({
      stripePaymentIntentId: paymentIntent.id,
    });
    if (order) {
      order.status = "paid";
      await order.save();
    }
  }

  res.json({ received: true });
};
