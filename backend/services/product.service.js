import { Product } from '../model/product.model.js';

// Services only talk to the database: no req/res in here, so the same
// functions can be reused by scripts or other controllers.

// Returns the product with this _id, or null if none exists.
export async function getProductById(id) {
  // TODO: Product.findById(...) with .lean() 
  // use the database and findbyid function on mongodb take note of what the .lean() function is in  
  return Product.findById(id).lean(); 
}

// Offset pagination: page 1 is the first `limit` products, sorted by _id.
// Returns an array of products.
export async function listProductsOffset({ page, limit }) {
  // Skip every product on the earlier pages: page 3 with limit 20 skips 40.
  return Product.find()
    .sort({ _id: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .lean();
}

// Cursor pagination: returns the `limit` products whose _id comes after `after`
// (or the first `limit` products when `after` is missing).
export async function listProductsCursor({ after, limit }) {
  // Start right after the last _id the client saw. The _id index jumps
  // straight there, so this stays fast however deep you page, unlike skip().
  const filter = after ? { _id: { $gt: after } } : {};
  return Product.find(filter)
    .sort({ _id: 1 })
    .limit(limit)
    .lean();
}; 
