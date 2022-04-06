import mongoose from "mongoose";
import { UserProfile as UserProfileSchema } from "../types";

const { model, models, Schema } = mongoose;

const UserProfileSchema = new Schema<UserProfileSchema>(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    billingAddress: {
      type: Schema.Types.Mixed,
      required: false,
    },
    paymentMethod: {
      type: Schema.Types.Mixed,
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const UserProfile =
  models.UserProfile ||
  model<UserProfileSchema>("UserProfile", UserProfileSchema);

export { UserProfile };
