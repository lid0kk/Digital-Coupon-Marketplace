import { Request, Response } from 'express';
import prisma from '../db';
import { calculateMinPrice } from '../services/productService';

export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, image_url, cost_price, margin_percentage, value_type, value } = req.body;

        if (cost_price < 0 || margin_percentage < 0) {
            return res.status(400).json({ error_code: 'BAD_REQUEST', message: 'Pricing must be >= 0' });
        }

        const product = await prisma.product.create({
            data: {
                name, description, image_url, cost_price, margin_percentage, value_type: value_type || 'STRING', value
            }
        });

        return res.status(201).json(product);
    } catch (error: any) {
        return res.status(500).json({ error_code: 'INTERNAL_SERVER_ERROR', message: 'Failed to create product' });
    }
};

export const getProducts = async (req: Request, res: Response) => {
    const products = await prisma.product.findMany();
    const productsWithCalculatedPrice = products.map(p => ({
        ...p,
        minimum_sell_price: calculateMinPrice(p.cost_price, p.margin_percentage)
    }));
    return res.status(200).json(productsWithCalculatedPrice);
};

export const updateProduct = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    const data = req.body;

    if (data.cost_price !== undefined && data.cost_price < 0) {
        return res.status(400).json({ error_code: 'BAD_REQUEST', message: 'Pricing must be >= 0' });
    }

    const updated = await prisma.product.update({
        where: { id: productId },
        data
    });
    return res.status(200).json(updated);
};

export const deleteProduct = async (req: Request, res: Response) => {
    const productId = req.params.productId as string;
    await prisma.product.delete({
        where: { id: productId }
    });
    return res.status(204).send();
};
