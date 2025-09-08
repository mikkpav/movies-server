import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/db.js';

const SECURE = true; // process.env.NODE_ENV === 'production';

export async function signupNewUser(request: Request, response: Response) {
    const { email, password } = request.body;

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        [email, hash]
    );

    const userId = result.rows[0].id;
    const token = jwt.sign({ userId, email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    response.cookie('token', token, { httpOnly: true, secure: SECURE });
    response.json({ userId, email });
}

export async function getCurrentUser(request: Request, response: Response) {
    const token = request.cookies?.token;
    console.log('--- cookies: ', request.cookies);
    if (!token) return response.status(401).json({ error: "Not authenticated" });

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string, email: string };
        response.cookie('token', token, { httpOnly: true, secure: SECURE });
        return response.json({ userId: payload.userId, email: payload.email });
    } catch (error) {
        return response.status(401).json({ error: "Invalid or expired token" });
    }
}

export async function login(request: Request, response: Response) {
    const { email, password } = request.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    const passwordsEqual = await bcrypt.compare(password, user.password_hash);
    if (!user || !passwordsEqual) {
        return response.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user.id, email: email }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    response.cookie('token', token, { httpOnly: true, secure: SECURE });
    response.json({ userId: user.id, email: email });
}

export async function logout(request: Request, response: Response) {
    response.clearCookie('token');
    response.json({ message: 'Logged out' });
}