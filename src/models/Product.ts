import mongoose from "mongoose";
import { Product as ProductEntity } from "../types";

const { model, models, Schema } = mongoose;

const ProductSchema = new Schema<ProductEntity>(
  {
    id: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      required: false,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Product =
  models.Product || model<ProductEntity>("Product", ProductSchema);

export { Product };
