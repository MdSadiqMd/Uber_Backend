import { Request, Response } from 'express';

import { authService } from '../services';
import { logger } from '../config';

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user, token } = await authService.register(req.body);
        res.status(201).send({
            data: { user, token },
            success: true,
            error: null,
            message: "Successfully Registered user",
        });
    } catch (error: any) {
        logger.error(`Error in Register user in Controller: ${error}`);
        res.status(400).send(error.message);
    }
};

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;
        const { user, token } = await authService.login({ email, password });
        res.status(201).send({
            data: { user, token },
            success: true,
            error: null,
            message: "Successfully Logged in user",
        });
    } catch (error: any) {
        logger.error(`Error in Login user in Controller: ${error}`);
        res.status(400).send(error.message);
    }
};

export const authController = { register, login };