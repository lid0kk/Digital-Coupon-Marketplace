import { Request, Response, NextFunction } from 'express';

export const resellerAuth = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            error_code: 'UNAUTHORIZED',
            message: 'Missing or invalid token'
        });
    }

    const token = authHeader.split(' ')[1];
    const validToken = process.env.RESELLER_TOKEN || 'reseller_secret';

    if (token !== validToken) {
        return res.status(401).json({
            error_code: 'UNAUTHORIZED',
            message: 'Invalid token'
        });
    }

    next();
};
