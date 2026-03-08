import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import 'express-async-errors';
import dotenv from 'dotenv';
import productRoutes from './routes/productRoutes';
import adminRoutes from './routes/adminRoutes';
import storeRoutes from './routes/storeRoutes';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/products', productRoutes);
app.use('/api/v1/admin/products', adminRoutes);
app.use('/api/v1/store', storeRoutes);

// Global Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);

    if ((err as any).name === 'ValidationError' || (err as any).statusCode === 400) {
        return res.status(400).json({
            error_code: (err as any).errorCode || 'BAD_REQUEST',
            message: err.message
        });
    }

    res.status(500).json({
        error_code: 'INTERNAL_SERVER_ERROR',
        message: 'Something went wrong'
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
