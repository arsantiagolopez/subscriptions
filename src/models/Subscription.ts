import mongoose from "mongoose";
import { Subscription as SubscriptionEntity } from "../types";
import { Price } from "./Price";

const { model, models, Schema } = mongoose;

const SubscriptionSchema = new Schema<SubscriptionEntity>(
  {
    id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
    },
    metadata: {
      type: Schema.Types.Mixed,
      required: false,
    },
    price_id: {
      type: String,
      required: false,
    },
    quantity: {
      type: Number,
      required: false,
    },
    cancel_at_period_end: {
      type: String,
      required: false,
    },
    created: {
      type: String,
      required: true,
    },
    current_period_start: {
      type: String,
      required: true,
    },
    current_period_end: {
      type: String,
      required: true,
    },
    ended_at: {
      type: String,
      required: false,
    },
    cancel_at: {
      type: String,
      required: false,
    },
    canceled_at: {
      type: String,
      required: false,
    },
    trial_start: {
      type: String,
      required: false,
    },
    trial_end: {
      type: String,
      required: false,
    },
    prices: {
      type: Price,
      ref: "Price",
      required: false,
    },
  },
  { timestamps: true }
);

// Prevent model overwrite upon initial compile
const Subscription =
  models.Subscription ||
  model<SubscriptionEntity>("Subscription", SubscriptionSchema);

export { Subscription };
