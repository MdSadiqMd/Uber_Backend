import { Request, Response } from 'express';

import { AuthService } from '../services';
import { logger } from '../config';

const authService = new AuthService();

export const authController = {
    register: async (req: Request, res: Response): Promise<void> => {
        try {
            const { user, token } = await authService.registerUser(req.body);
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
    },

    login: async (req: Request, res: Response): Promise<void> => {
        try {
            const { email, password } = req.body;
            const { user, token } = await authService.loginUser({ email, password });
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
    },
};