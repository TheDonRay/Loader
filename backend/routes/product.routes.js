import { Router } from 'express';
import { getProduct, listProducts } from '../controllers/product.controller.js';

const router = Router();

// Paths are relative to where app.js mounts this router (/products)
router.get('/', listProducts);
router.get('/:id', getProduct);

export default router;
