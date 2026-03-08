import { Router } from 'express';
import { createProduct, updateProduct, deleteProduct, getProducts } from '../controllers/adminController';

const router = Router();

router.post('/', createProduct);
router.get('/', getProducts);
router.put('/:productId', updateProduct);
router.delete('/:productId', deleteProduct);

export default router;
