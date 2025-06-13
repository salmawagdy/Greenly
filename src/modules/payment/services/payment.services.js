import Stripe from "stripe";
import Cart from "../../../DB/model/cartShopping.model.js";
import Order from "../../../DB/model/order.model.js";
import UserAddress from "../../../DB/model/addresses.model.js";


const stripe = new Stripe(
  "sk_test_51RIsu6PcDaK4NqZIDd8y7NYBIf0qWGLAhTgQUouiIRQNHI9JjW1GZGVdLYpAK0kzgJK00diA1EBBQWGV7Hxuev0F00RS8Zn65M"
);

export const createCheckoutSession = async (req, res) => {
  console.log("Authenticated user:", req.user);

  try {
    const cart = await Cart.findOne({
      userId: req.user._id,
      status: "active",
    }).populate("products.productId");

    if (!cart || cart.products.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const userId = req.user._id;
    let address = req.body.address;
    if (!address) {
      const userAddresses = await UserAddress.findOne({ userId });
      if (!userAddresses) return res.status(400).json({ message: "No address found" });

      const defaultAddress = userAddresses.addresses.find(addr => addr.isDefault);
      if (!defaultAddress) return res.status(400).json({ message: "No default address set" });

      address = defaultAddress;
    }
    //const { address } = req.body;
    const phone = address.phone;

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
      success_url: `${process.env.CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/cancel`,
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
      checkoutSessionId: session.id,
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
      checkoutSessionId: session.id,
    });
    if (order) {
      order.status = "paid";
      await order.save();
      const userId = order.userId;

      const userCart = await Cart.findOne({ userId, status: "active" });
      if (userCart) {
        userCart.products = [];
        userCart.totalPrice = 0;
        await userCart.save();
      }
    }
  }
  if (event.type === "checkout.session.expired") {
    const session = event.data.object;
    const order = await Order.findOne({
      checkoutSessionId: session.id,
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
    const orders = await Order.find()
      .populate("userId", "userName email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All orders fetched successfully",
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

    const order = await Order.findById(id).populate("userId", "userName email");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({
      message: "Order fetched successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { newStatus } = req.body;
    const validStatuses = ["pending", "shipment", "shipped"];
    if (!validStatuses.includes(newStatus)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

