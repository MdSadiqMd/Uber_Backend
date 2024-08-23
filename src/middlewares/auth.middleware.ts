import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models';
import { logger } from '../config';

interface JwtPayload {
    id: string;
}

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).send('Access Denied');
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;
        const user = await User.findById(verified.id).exec();
        if (!user) {
            return res.status(401).send('User not found');
        }
        req.user = user;
        next();
    } catch (error) {
        logger.error(`Error in auth Middleware: ${error}`);
        res.status(400).send('Invalid Token');
    }
};

export default authMiddleware;