import Stripe from "stripe";

const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? "",
  {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: "2020-08-27",
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
      name: "Subscriptions Boilerplate",
      version: "0.1.0",
    },
  }
);

export { stripe };
