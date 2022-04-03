import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "node:stream";
import Stripe from "stripe";
import { dbConnect } from "../../../utils/dbConnect";
import { stripe } from "../../../utils/stripe";
import { manageSubscription } from "../customers";
import { upsertPrice } from "../prices";
import { upsertProduct } from "../products";

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const buffer = async (readable: Readable) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
};

const relevantEvents = new Set([
  "product.created",
  "product.updated",
  "price.created",
  "price.updated",
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

const handleWebhooks = async (req: NextApiRequest, res: NextApiResponse) => {
  const buf = await buffer(req);
  const sig = req.headers["stripe-signature"];
  const webhookSecret =
    process.env.STRIPE_WEBHOOK_SECRET_LIVE ?? process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (error: any) {
    console.log(`❌ Error message: ${error.message}`);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }

  const { type, data } = event;

  if (relevantEvents.has(type)) {
    try {
      switch (type) {
        // Product created
        case "product.created":

        // Product updated
        case "product.updated":
          await upsertProduct(data.object as Stripe.Product);
          break;

        // Price created
        case "price.created":

        // Price updated
        case "price.updated":
          await upsertPrice(data.object as Stripe.Price);
          break;

        // Customer subscription created
        case "customer.subscription.created":

        // Customer subscription updated
        case "customer.subscription.updated":

        // Customer subscription deleted
        case "customer.subscription.deleted":
          const subscription = data.object as Stripe.Subscription;
          await manageSubscription(
            subscription.id,
            subscription.customer as string,
            type === "customer.subscription.created"
          );
          break;

        // Checkout session completed
        case "checkout.session.completed":
          const checkoutSession = data.object as Stripe.Checkout.Session;
          if (checkoutSession.mode === "subscription") {
            const subscriptionId = checkoutSession.subscription;
            await manageSubscription(
              subscriptionId as string,
              checkoutSession.customer as string,
              true
            );
          }
          break;
        default:
          throw new Error("Unhandled relevant event!");
      }
    } catch (error: any) {
      console.log(error);
      return res
        .status(400)
        .send('Webhook error: "Webhook handler failed. View logs."');
    }
  }

  res.json({ received: true });
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  // const data = (await getSession({ req })) as unknown as UserSession;
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "POST":
      return handleWebhooks(req, res);
    default:
      res.setHeader("Allow", "POST");
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
