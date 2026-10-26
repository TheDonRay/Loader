import 'dotenv/config';
import { parseArgs } from 'node:util';
import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { connectDB, disconnectDB } from '../config/dbconnection.config.js';
import { Product } from '../model/product.model.js';
import { Review } from '../model/review.model.js';

// Usage: npm run seed -- --products 100000 --reviews 500000
const { values } = parseArgs({
  options: {
    products: { type: 'string', default: '10000' },
    reviews: { type: 'string', default: '50000' },
    batch: { type: 'string', default: '5000' },
  },
});

const PRODUCT_COUNT = Number(values.products);
const REVIEW_COUNT = Number(values.reviews);
const BATCH_SIZE = Number(values.batch);

// Fixed seed + fixed date range = the same dataset on every run
const SEED = 42;
const DATE_FROM = new Date('2022-01-01T00:00:00Z');
const DATE_TO = new Date('2025-01-01T00:00:00Z');

// Deterministic ObjectIds: fixed 4-byte timestamp + 8-byte counter.
// The same index always gets the same _id, and _id order matches insert order,
// which keeps cursor pagination results reproducible across runs.
const BASE_TS = Math.floor(DATE_FROM.getTime() / 1000).toString(16).padStart(8, '0');
const objectIdFor = (i) =>
  new mongoose.Types.ObjectId(BASE_TS + i.toString(16).padStart(16, '0'));

function makeProduct(i) {
  return {
    _id: objectIdFor(i),
    name: faker.commerce.productName(),
    category: faker.commerce.department(),
    price: faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }),
    rating: faker.number.float({ min: 1, max: 5, fractionDigits: 1 }),
    createdAt: faker.date.between({ from: DATE_FROM, to: DATE_TO }),
  };
}

function makeReview(i) {
  return {
    _id: objectIdFor(i),
    productId: objectIdFor(faker.number.int({ min: 0, max: PRODUCT_COUNT - 1 })),
    rating: faker.number.int({ min: 1, max: 5 }),
    body: faker.lorem.sentences({ min: 1, max: 3 }),
    createdAt: faker.date.between({ from: DATE_FROM, to: DATE_TO }),
  };
}

async function dropCollection(model) {
  try {
    await model.collection.drop();
  } catch (err) {
    // 26 = NamespaceNotFound, i.e. the collection doesn't exist yet
    if (err.code !== 26) throw err;
  }
}

// Inserts through the raw driver collection: skipping Mongoose validation and
// hydration matters when inserting millions of documents.
async function seedCollection(model, count, makeDoc) {
  const name = model.collection.collectionName;
  const started = Date.now();

  for (let start = 0; start < count; start += BATCH_SIZE) {
    const end = Math.min(start + BATCH_SIZE, count);
    const docs = [];
    for (let i = start; i < end; i++) docs.push(makeDoc(i));

    await model.collection.insertMany(docs, { ordered: false });
    process.stdout.write(`\r${name}: ${end.toLocaleString()} / ${count.toLocaleString()}`);
  }

  const seconds = ((Date.now() - started) / 1000).toFixed(1);
  console.log(`\n${name}: done in ${seconds}s`);
}

async function main() {
  if (![PRODUCT_COUNT, REVIEW_COUNT, BATCH_SIZE].every((n) => Number.isInteger(n) && n > 0)) {
    throw new Error('--products, --reviews and --batch must be positive integers');
  }

  faker.seed(SEED);
  await connectDB();

  console.log(`Seeding ${PRODUCT_COUNT.toLocaleString()} products and ${REVIEW_COUNT.toLocaleString()} reviews (seed ${SEED})`);
  console.log('Dropping existing products and reviews collections...');
  await dropCollection(Product);
  await dropCollection(Review);

  await seedCollection(Product, PRODUCT_COUNT, makeProduct);
  await seedCollection(Review, REVIEW_COUNT, makeReview);
}

try {
  await main();
} catch (err) {
  console.error('\nSeed failed:', err.message);
  process.exitCode = 1;
} finally {
  await disconnectDB();
}
