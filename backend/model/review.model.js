import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// No secondary indexes are declared here on purpose: the productId index is
// created by scripts/indexes.js so it can be toggled for experiments.

const reviewSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    body: { type: String, trim: true },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const Review = model('Review', reviewSchema, 'reviews');
