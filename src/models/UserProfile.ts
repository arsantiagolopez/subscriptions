import mongoose from "mongoose";
import { UserProfileEntity } from "../types";

const { model, models, Schema } = mongoose;

const UserProfileSchema = new Schema<UserProfileEntity>(
  {
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
  model<UserProfileEntity>("UserProfile", UserProfileSchema);

export { UserProfile };
