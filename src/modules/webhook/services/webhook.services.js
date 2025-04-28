import Order from "../../../DB/model/order.model.js";
import { Stripe } from "stripe";
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Webhook handler for Stripe events
export const handleStripeWebhook = async (req, res) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET; // Your Stripe webhook secret key

  let event;

  try {
    // Verify the webhook signature to ensure it came from Stripe
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);

    // Handle the event based on its type
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount_received} was successful!`
        );

        // Find the corresponding order and update it
        const order = await Order.findOne({
          paymentIntentId: paymentIntent.id,
        });
        if (order) {
          order.status = "paid"; // Update the order status to 'paid'
          await order.save();
          console.log("Order status updated to paid");
        }
        break;

      case "payment_intent.payment_failed":
        const paymentFailedIntent = event.data.object;
        console.log(
          `PaymentIntent failed: ${paymentFailedIntent.last_payment_error.message}`
        );

        // Find the corresponding order and update it
        const failedOrder = await Order.findOne({
          paymentIntentId: paymentFailedIntent.id,
        });
        if (failedOrder) {
          failedOrder.status = "failed"; // Update the order status to 'failed'
          await failedOrder.save();
          console.log("Order status updated to failed");
        }
        break;

      case "checkout.session.completed":
        const session = event.data.object;
        console.log(`Checkout session completed for session: ${session.id}`);

        // Here you can handle any necessary actions when the checkout session is completed
        // e.g., updating order status or creating new records
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Respond to Stripe to acknowledge receipt of the event
    res.status(200).send("Event received");
  } catch (err) {
    console.log(`Error: ${err.message}`);
    res.status(400).send(`Webhook error: ${err.message}`);
  }
};
