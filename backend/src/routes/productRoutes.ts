import { Router } from 'express';
import { getAvailableProducts, getProductById, purchaseProduct } from '../controllers/productController';
import { resellerAuth } from '../middlewares/authMiddleware';

const router = Router();

// Apply reseller auth
router.use(resellerAuth);

router.get('/', getAvailableProducts);
router.get('/:productId', getProductById);
router.post('/:productId/purchase', purchaseProduct);

export default router;
