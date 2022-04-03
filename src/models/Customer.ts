import mongoose from "mongoose";
import { Customer as CustomerEntity } from "../types";

const { model, models, Schema } = mongoose;

const CustomerSchema = new Schema<CustomerEntity>(
  {
    id: {
      type: String,
      required: true,
    },
    stripe_customer_id: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Customer =
  models.Customer || model<CustomerEntity>("Customer", CustomerSchema);

export { Customer };
