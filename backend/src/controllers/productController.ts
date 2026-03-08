import { Request, Response } from 'express';
import prisma from '../db';
import { formatResellerProduct, calculateMinPrice } from '../services/productService';

export const getAvailableProducts = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany({
        where: { is_sold: false }
    });

    const formatted = products.map(formatResellerProduct);
    return res.status(200).json(formatted);
};

export const getProductById = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;

    const product = await prisma.product.findUnique({
        where: { id: productId }
    });

    if (!product || product.is_sold) {
        return res.status(404).json({
            error_code: 'PRODUCT_NOT_FOUND',
            message: 'Product not found'
        });
    }

    return res.status(200).json(formatResellerProduct(product as any));
};

export const purchaseProduct = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const { reseller_price } = req.body;

    if (reseller_price === undefined || typeof reseller_price !== 'number') {
        return res.status(400).json({
            error_code: 'BAD_REQUEST',
            message: 'Provide valid reseller_price'
        });
    }

    try {
        const result = await prisma.$transaction(async (tx) => {
            const product = await tx.product.findUnique({
                where: { id: productId }
            });

            if (!product) {
                throw new Error('PRODUCT_NOT_FOUND');
            }

            if (product.is_sold) {
                throw new Error('PRODUCT_ALREADY_SOLD');
            }

            const minPrice = calculateMinPrice(product.cost_price, product.margin_percentage);

            if (reseller_price < minPrice) {
                throw new Error('RESELLER_PRICE_TOO_LOW');
            }

            const updated = await tx.product.update({
                where: { id: productId },
                data: { is_sold: true }
            });

            return updated;
        });

        return res.status(200).json({
            product_id: result.id,
            final_price: reseller_price,
            value_type: result.value_type,
            value: result.value
        });

    } catch (err: any) {
        if (['PRODUCT_NOT_FOUND', 'PRODUCT_ALREADY_SOLD', 'RESELLER_PRICE_TOO_LOW'].includes(err.message)) {
            const status = err.message === 'PRODUCT_NOT_FOUND' ? 404 :
                err.message === 'PRODUCT_ALREADY_SOLD' ? 409 : 400;

            const humanReadableMessages: Record<string, string> = {
                'PRODUCT_NOT_FOUND': 'Product not found',
                'PRODUCT_ALREADY_SOLD': 'Product already sold',
                'RESELLER_PRICE_TOO_LOW': 'Reseller price too low'
            };

            return res.status(status).json({
                error_code: err.message,
                message: humanReadableMessages[err.message] || err.message
            });
        }
        throw err;
    }
};
