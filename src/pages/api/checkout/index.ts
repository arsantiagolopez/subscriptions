import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { UserEntity } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";
import { getURL } from "../../../utils/getURL";
import { stripe } from "../../../utils/stripe";
import { findOrCreateCustomer } from "../customers";

/**
 * Creates a checkout session.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @returns
 */
const createCheckoutSession = async (
  { body }: NextApiRequest,
  res: NextApiResponse,
  user: UserEntity
) => {
  const { price, quantity = 1, metadata = {} } = body;

  try {
    const customer = await findOrCreateCustomer(
      user?.id || "",
      user?.email || ""
    );

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      billing_address_collection: "required",
      customer,
      line_items: [
        {
          price: price.id,
          quantity,
        },
      ],
      mode: "subscription",
      allow_promotion_codes: true,
      subscription_data: {
        trial_from_plan: true,
        metadata,
      },
      success_url: `${getURL()}/account`,
      cancel_url: `${getURL()}/`,
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error: any) {
    console.log(`❌ Error message: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const data = await getSession({ req });

  const { method } = req;

  if (!data?.user) {
    return res.status(405).end("Must be authenticated.");
  }

  // @todo: Make sure user is being properly passed

  await dbConnect();

  switch (method) {
    case "POST":
      return createCheckoutSession(req, res, data?.user);
    default:
      res.setHeader("Allow", "POST");
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
