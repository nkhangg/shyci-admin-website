import { User } from '@/types/user';
import axios from '../config';
import { IBaseApi } from '../../../interface';

export const login = async (data: { username: string; password: string }) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'auths/login?type=admin',
            data,
        });

        if (!response) return null;

        return response.data as IBaseApi<{ token: string; refreshToken: string }> & { errors?: { username?: string; password?: string } };
    } catch (error) {
        return null;
    }
};

export const profilePoper = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'admins/current',
        });

        if (!response) return null;

        return response.data as IBaseApi<User>;
    } catch (error) {
        return null;
    }
};
