import mongoose from "mongoose";
import { UserEntity } from "../types";

const { model, models, Schema } = mongoose;

const UserSchema = new Schema<UserEntity>(
  {
    id: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    emailVerified: {
      type: Date,
      required: false,
    },
    isMember: {
      type: Boolean,
      required: true,
      default: false,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const User = models.User || model<UserEntity>("User", UserSchema);

export { User };
