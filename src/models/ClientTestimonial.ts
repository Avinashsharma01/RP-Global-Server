import mongoose, { Document, Schema, Model } from "mongoose";

export interface IClientTestimonial extends Document {
  clientName: string;
  designation: string;
  company: string;
  feedback: string;
  rating: number;
  plantInstalled: string;
  isApproved: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const clientTestimonialSchema = new Schema<IClientTestimonial>(
  {
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    designation: {
      type: String,
      required: true,
      trim: true,
    },
    company: {
      type: String,
      required: true,
      trim: true,
    },
    feedback: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      default: 5,
      min: 1,
      max: 5,
    },
    plantInstalled: {
      type: String,
      required: true,
      trim: true,
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const ClientTestimonial: Model<IClientTestimonial> =
  mongoose.models.ClientTestimonial ||
  mongoose.model<IClientTestimonial>("ClientTestimonial", clientTestimonialSchema);
