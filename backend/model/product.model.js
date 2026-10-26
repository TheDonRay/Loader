import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// No secondary indexes are declared here on purpose: Q2 compares indexed vs
// unindexed queries, so scripts/indexes.js owns index creation.

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    createdAt: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const Product = model('Product', productSchema, 'products');
