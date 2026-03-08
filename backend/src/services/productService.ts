import { Prisma } from '@prisma/client';

export type ProductEntity = {
    id: string;
    name: string;
    description: string;
    type: string;
    image_url: string;
    cost_price: Prisma.Decimal;
    margin_percentage: Prisma.Decimal;
    is_sold: boolean;
    value_type: string;
    value: string;
    created_at: Date;
    updated_at: Date;
};

export const calculateMinPrice = (cost: Prisma.Decimal, margin: Prisma.Decimal): number => {
    const c = cost.toNumber();
    const m = margin.toNumber();
    const minPrice = c * (1 + m / 100);
    return Number(minPrice.toFixed(2));
};

export const formatResellerProduct = (product: ProductEntity) => {
    return {
        id: product.id,
        name: product.name,
        description: product.description,
        image_url: product.image_url,
        price: calculateMinPrice(product.cost_price, product.margin_percentage)
    };
};
