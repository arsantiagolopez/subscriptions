import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { Product } from "../../../models/Product";
import { ProductWithPrice } from "../../../types";
import { dbConnect } from "../../../utils/dbConnect";

/**
 * Update or create a product.
 * @param req - HTTP request.
 * @param res - HTTP response.
 * @retuns an array of products.
 */
const getActiveProductsWithPrices = async (
  _: NextApiRequest,
  res: NextApiResponse
): Promise<ProductWithPrice[] | void> => {
  let products = [];

  try {
    const data = await Product.find({ active: true, prices: { active: true } });

    // @todo: TEST
    console.log(data);

    if (!data) {
      console.log("No products active.");
    }

    products = data;

    return products;
  } catch (error: any) {
    console.log(`❌ Error message: ${error.message}`);
    return res.status(500).json({ error: error.message });
  }
};

/**
 * Update or create a product.
 * @param product - Stripe product data.
 */
const upsertProduct = async (product: Stripe.Product) => {
  const { id, active, name, description, images, metadata } = product;

  const data = {
    id,
    active,
    name,
    metadata,
    description: description ?? undefined,
    image: images?.[0] ?? null,
  };

  try {
    await Product.findByIdAndUpdate(id, data, { upsert: true });

    // Successfully upserted
    console.log(`Product inserted/updated: ${product.id}`);
  } catch (error: any) {
    console.log(error);
  }
};

// Main
const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      return getActiveProductsWithPrices(req, res);
    default:
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export { upsertProduct };

export default handler;
