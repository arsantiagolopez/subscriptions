import mongoose from "mongoose";
import { UserDetails as UserDetailsSchema } from "../types";

const { model, models, Schema } = mongoose;

const UserDetailsSchema = new Schema<UserDetailsSchema>(
  {
    id: {
      type: String,
      required: true,
    },
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    full_name: {
      type: String,
      required: false,
    },
    avatar_url: {
      type: String,
      required: false,
    },
    billing_address: {
      type: Schema.Types.Mixed,
      required: false,
    },
    payment_method: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const UserDetails =
  models.UserDetails ||
  model<UserDetailsSchema>("UserDetails", UserDetailsSchema);

export { UserDetails };
