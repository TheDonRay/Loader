import * as productService from '../services/product.service.js';

// Controllers turn HTTP into service calls and service results into HTTP.
// Express 5 forwards errors thrown in async handlers to the error middleware,
// so no try/catch is needed here.

// GET /products/:id
export async function getProduct(req, res) {
  // TODO: read the id from req.params
  // TODO: call productService.getProductById
  // TODO: 404 with a message if it returned null, otherwise 200 with the product
}

// GET /products?page=1&limit=20          -> offset pagination
// GET /products?after=<id>&limit=20      -> cursor pagination
export async function listProducts(req, res) {
  // TODO: read page, after and limit from req.query (they arrive as strings)
  // TODO: give limit a default (e.g. 20) and a maximum (e.g. 100)
  // TODO: if `after` is present, call listProductsCursor and also return
  //       nextCursor = the _id of the last product (or null if none came back)
  // TODO: otherwise call listProductsOffset with page (default 1)
}
