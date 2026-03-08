import prisma from './src/db';

async function testCreate() {
    try {
        const product = await prisma.product.create({
            data: {
                name: "Test",
                description: "Test Desc",
                image_url: "http://example.com/img.jpg",
                cost_price: 10.5,
                margin_percentage: 20,
                value_type: 'STRING',
                value: "CODE-123"
            }
        });
        console.log("Success:", product);
    } catch (e) {
        console.error("Error creating product:", e);
    } finally {
        await prisma.$disconnect();
    }
}
testCreate();
