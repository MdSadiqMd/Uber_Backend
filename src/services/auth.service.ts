import jwt from 'jsonwebtoken';

import { User } from '../models';
import { IUser } from '../types';
import { serverConfig } from '../config';

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    user: IUser;
    token: string;
}

class AuthService {
    async registerUser(userData: IUser): Promise<AuthResponse> {
        const user = new User(userData);
        await user.save();
        const token = jwt.sign({ id: user._id }, serverConfig.JWT_SECRET as string, { expiresIn: '1h' });
        return { user, token };
    }

    async loginUser({ email, password }: LoginData): Promise<AuthResponse> {
        const user = await User.findOne({ email }) as IUser | null;
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid email or password');
        }
        const token = jwt.sign({ id: user._id }, serverConfig.JWT_SECRET as string, { expiresIn: '1h' });
        return { user, token };
    }
}

export default AuthService;