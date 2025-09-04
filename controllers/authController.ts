import type { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../db/db.js';

export async function signupNewUser(request: Request, response: Response) {
    const { email, password } = request.body;

    const hash = await bcrypt.hash(password, 10);

    const result = await pool.query(
        'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id',
        [email, hash]
    );

    const userId = result.rows[0].id;

    const token = jwt.sign({ userId }, process.env.JWT_SECRET!, {
        expiresIn: '1h',
    });

    response.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    response.json({ userId });
}

export async function login(request: Request, response: Response) {
    const { email, password } = request.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return response.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    response.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    response.json({ userId: user.id });
}

export async function logout(request: Request, response: Response) {
    response.clearCookie('token');
    response.json({ message: 'Logged out' });
}