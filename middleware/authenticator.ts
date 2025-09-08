import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    userId?: number;
    email?: string;
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
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: number, email: string };
        request.userId = payload.userId;
        request.email = payload.email;
        next();
    } catch (err) {
        return response.status(401).json({ message: 'Invalid or expired token' });
    }
}
