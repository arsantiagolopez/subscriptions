import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import Stripe from "stripe";
import { Customer } from "../../../models/Customer";
import { Subscription } from "../../../models/Subscription";
import { UserDetails } from "../../../models/UserDetails";
import { UserEntity, UserSession } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
import { getURL } from "../../../utils/getURL";
import { stripe } from "../../../utils/stripe";
import { toDateTime } from "../../../utils/toDateTime";

/**
 * Manage a customer's subscription.
 * @param subscriptionId - Subscription ID.
 * @param stripe_customer_id - Stripe customer ID.
 * @param createAction - Boolean flag to determine create or update.
 */
const manageSubscription = async (
  subscriptionId: string,
  stripe_customer_id: string,
  createAction = false
) => {
  try {
    // Get customer's UUID from mapping table.
    const customer = await Customer.findOne({ stripe_customer_id });

    if (!customer) {
      return console.log("No customer found with that Stripe ID.");
    }

    const { id: user_id } = customer;

    const {
      id,
      metadata,
      status,
      items,
      cancel_at_period_end,
      cancel_at,
      canceled_at,
      current_period_start,
      current_period_end,
      created,
      ended_at,
      trial_start,
      trial_end,
      default_payment_method,
    } = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["default_payment_method"],
    });

    // Upsert the latest status of the subscription object.
    const data = {
      id,
      user_id,
      metadata,
      status,
      price_id: items.data[0].price.id,
      // @todo check quantity on subscription
      // @ts-ignore
      quantity: subscription.quantity,
      cancel_at_period_end,
      cancel_at: cancel_at ? toDateTime(cancel_at) : null,
      canceled_at: canceled_at ? toDateTime(canceled_at) : null,
      current_period_start: toDateTime(current_period_start),
      current_period_end: toDateTime(current_period_end),
      created: toDateTime(created),
      ended_at: ended_at ? toDateTime(ended_at) : null,
      trial_start: trial_start ? toDateTime(trial_start) : null,
      trial_end: trial_end ? toDateTime(trial_end) : null,
    };

    // Create Subscription record
    await Subscription.findByIdAndUpdate(id, data, {
      upsert: true,
    });

    console.log(`Inserted/updated subscription [${id}] for user [${user_id}]`);

    // For a new subscription copy the billing details to the customer object.
    // NOTE: This is a costly operation and should happen at the very end.
    if (createAction && default_payment_method && user_id) {
      //@ts-ignore
      await copyBillingDetailsToCustomer(
        user_id,
        default_payment_method as Stripe.PaymentMethod
      );
    }
  } catch (error: any) {
    console.log(error);
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 * @param user_id - Stripe user ID.
 * @param payment_method - Stripe payment method.
 */
const copyBillingDetailsToCustomer = async (
  user_id: string,
  payment_method: Stripe.PaymentMethod
) => {
  // @todo: check this assertion
  const { customer, billing_details, type } = payment_method;

  const { name, phone, address } = billing_details;

  if (!name || !phone || !address) return;

  try {
    // @ts-ignore
    await stripe.customers.update(customer, { name, phone, address });

    const details = {
      billing_address: address,
      payment_method: payment_method[type],
    };

    // Update UserDetails record
    await UserDetails.findByIdAndUpdate(user_id, details, { upsert: true });
  } catch (error: any) {
    console.log("Could not copy billing deatils to customer.");
  }
};

/**
 *
 * @param id - ID.
 * @param email - Email
 * @returns
 */
const findOrCreateCustomer = async (
  id: string,
  email: string
): Promise<string | undefined> => {
  try {
    const customer = await Customer.findById(id);

    interface CustomerData {
      metadata: { dbId: string };
      email?: string;
    }

    // Customer doesn't exist, create one
    if (!customer) {
      const data: CustomerData = {
        metadata: {
          dbId: id,
        },
      };

      if (email) data.email = email;

      const { id: stripe_customer_id } = await stripe.customers.create(data);

      // Relate customer ID back to user entity
      await Customer.findByIdAndUpdate(id, { stripe_customer_id });

      // Return customer ID
      return stripe_customer_id;
    }

    // Customer found, return id
    return customer.id;
  } catch (error: any) {
    console.log("Could not fetch or create a customer.");
    return;
  }
};

/**
 * Create customer portal link
 * @param req - HTTP Request.
 * @param res - HTTP Response.
 * @returns
 */
const createPortalLink = async (
  _: NextApiRequest,
  res: NextApiResponse,
  user: UserEntity
) => {
  try {
    const customer = await findOrCreateCustomer(
      user.id || "",
      user.email || ""
    );

    if (!customer) {
      return res.status(500).json("Could not get customer.");
    }

    const { url } = await stripe.billingPortal.sessions.create({
      customer,
      return_url: `${getURL()}/account`,
    });

    return res.status(200).json({ url });
  } catch (error: any) {
    console.log(`❌ Error message: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = (await getSession({ req })) as unknown as UserSession;

  const { method } = req;

  if (!data?.user) {
    return res.status(405).end("Must be authenticated.");
  }

  // @todo: Make sure user is being properly passed

  await dbConnect();

  switch (method) {
    case "POST":
      return createPortalLink(req, res, data?.user);
    default:
      res.setHeader("Allow", "POST");
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export { manageSubscription, findOrCreateCustomer };

export default handler;
