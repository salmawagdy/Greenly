import Stripe from "stripe";
import Cart from "../../../DB/model/cartShopping.model.js";
import Order from "../../../DB/model/order.model.js";
const stripe = new Stripe(
  "sk_test_51RIsu6PcDaK4NqZIDd8y7NYBIf0qWGLAhTgQUouiIRQNHI9JjW1GZGVdLYpAK0kzgJK00diA1EBBQWGV7Hxuev0F00RS8Zn65M"
);

export const createCheckoutSession = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user._id,
      status: "active",
    }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }
    const { address, phone } = req.body;

    const lineItems = cart.products.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.productId.name,
          description: item.productId.shortdescription,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.ngrok_url}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.ngrok_url}/cancel`,
      metadata: {
        userId: req.user._id.toString(),
        address: JSON.stringify(address),
        phone,
      },
    });

    // Create order with status 'pending'
    const newOrder = new Order({
      userId: req.user._id,
      items: cart.products.map((p) => ({
        productId: p.productId._id,
        quantity: p.quantity,
        price: p.price,
      })),
      amount: cart.totalPrice,
      status: "pending",
      paymentIntentId: session.payment_intent,
      shippingAddress: address,
      phone,
    });

    await newOrder.save();

    res.status(200).json({ url: session.url });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const order = await Order.findOne({
      paymentIntentId: session.payment_intent,
    });
    if (order) {
      order.status = "paid";
      await order.save();
    }
  }
   if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const order = await Order.findOne({
      paymentIntentId: session.payment_intent,
    });
    if (order) {
      order.status = "cancelled";
      await order.save();
    }
  }

  res.status(200).json({ received: true });
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'userName email').sort({ createdAt: -1 });

    res.status(200).json({
      message: 'All orders fetched successfully',
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getSingleOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id).populate('userId', 'userName email');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({
      message: 'Order fetched successfully',
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// export const createStripeOrder = async (req, res) => {
//   try {
//     const cart = await Cart.findOne({ userId: req.user._id, status: 'active' }).populate('products.productId');
//     if (!cart || cart.products.length === 0) {
//       return res.status(400).json({ message: 'Cart is empty' });
//     }

//     // Create Stripe PaymentIntent
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: Math.round(cart.totalPrice * 100), // in cents
//       currency: 'usd',
//       metadata: { userId: req.user._id.toString() },
//     });

//     // Create Order in DB (pending)
//     const order = await Order.create({
//       userId: req.user._id,
//       products: cart.products,
//       amount: cart.totalPrice,
//       status: 'pending',
//       stripePaymentIntentId: paymentIntent.id,
//     });

//     res.status(200).json({
//       message: 'Stripe payment initiated',
//       clientSecret: paymentIntent.client_secret,
//       orderId: order._id,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// export const stripeWebhook = async (req, res) => {
//   const sig = req.headers['stripe-signature'];

//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(req.rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
//   } catch (err) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === 'payment_intent.succeeded') {
//     const paymentIntent = event.data.object;

//     const order = await Order.findOne({ stripePaymentIntentId: paymentIntent.id });
//     if (order) {
//       order.status = 'paid';
//       await order.save();
//     }
//   }

//   res.json({ received: true });
// };
