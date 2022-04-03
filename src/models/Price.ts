import mongoose from "mongoose";
import { Price as PriceEntity } from "../types";
import { Product } from "./Product";

const { model, models, Schema } = mongoose;

const PriceSchema = new Schema<PriceEntity>(
  {
    id: {
      type: String,
      required: true,
    },
    product_id: {
      type: String,
      required: false,
    },
    active: {
      type: Boolean,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    unit_amount: {
      type: Number,
      required: false,
    },
    currency: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      required: false,
    },
    interval: {
      type: String,
      required: false,
    },
    interval_count: {
      type: Number,
      required: false,
    },
    trial_period_days: {
      type: Number,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
    products: {
      type: Product,
      ref: "Product",
      required: true,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Price = models.Price || model<PriceEntity>("Price", PriceSchema);

export { Price };
