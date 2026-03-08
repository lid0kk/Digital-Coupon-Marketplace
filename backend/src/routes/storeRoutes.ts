import { Router } from 'express';
import { getStoreProducts, purchaseStoreProduct } from '../controllers/storeController';

const router = Router();

router.get('/products', getStoreProducts);
router.post('/products/:productId/purchase', purchaseStoreProduct);

export default router;
