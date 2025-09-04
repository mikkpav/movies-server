import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
    userId?: number;
}

export function requireAuth(
    request: AuthenticatedRequest, 
    response: Response, 
    next: NextFunction
) {
    const token = request.cookies.token;

    if (!token) {
        return response.status(401).json({ message: 'Not authenticated' });
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number };
        request.userId = payload.userId;
        next();
    } catch (err) {
        return response.status(401).json({ message: 'Invalid or expired token' });
    }
}
