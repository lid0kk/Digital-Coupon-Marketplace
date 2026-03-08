import { Request, Response } from 'express';
import prisma from '../db';
import { formatResellerProduct, calculateMinPrice } from '../services/productService';

export const getStoreProducts = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: { is_sold: false }
    });
    const formatted = products.map(formatResellerProduct);
    return res.status(200).json(formatted);
};

export const purchaseStoreProduct = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;

    try {
        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: productId }
            });

            if (!product) throw new Error('PRODUCT_NOT_FOUND');
            if (product.is_sold) throw new Error('PRODUCT_ALREADY_SOLD');

            const updated = await tx.product.update({
                where: { id: productId },
                data: { is_sold: true }
            });

            return updated;
        });

        const finalPrice = calculateMinPrice(result.cost_price, result.margin_percentage);

        return res.status(200).json({
            product_id: result.id,
            final_price: finalPrice,
            value_type: result.value_type,
            value: result.value
        });
    } catch (err: any) {
        if (['PRODUCT_NOT_FOUND', 'PRODUCT_ALREADY_SOLD'].includes(err.message)) {
            const status = err.message === 'PRODUCT_NOT_FOUND' ? 404 : 409;

            const humanReadableMessages: Record<string, string> = {
                'PRODUCT_NOT_FOUND': 'Product not found',
                'PRODUCT_ALREADY_SOLD': 'Product already sold'
            };

            return res.status(status).json({
                error_code: err.message,
                message: humanReadableMessages[err.message] || err.message
            });
        }
        throw err;
    }
};
