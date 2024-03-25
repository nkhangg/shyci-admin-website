'use client';

import { login, profilePoper } from '@/apis/handlers/auth';
import type { User } from '@/types/user';
import { keysLocalStorage } from '@/ultils/local-storege';

function generateToken(): string {
    const arr = new Uint8Array(12);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, (v) => v.toString(16).padStart(2, '0')).join('');
}

const user = {
    id: 'USR-000',
    avatar: '/assets/avatar.png',
    firstName: 'Sofia',
    lastName: 'Rivers',
    email: 'sofia@devias.io',
} satisfies User;

export interface SignUpParams {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface SignInWithOAuthParams {
    provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
    email: string;
    password: string;
}

export interface ResetPasswordParams {
    email: string;
}

class AuthClient {
    async signUp(_: SignUpParams): Promise<{ error?: string }> {
        // Make API request

        // We do not handle the API, so we'll just generate a token and store it in localStorage.
        const token = generateToken();
        localStorage.setItem('custom-auth-token', token);

        return {};
    }

    async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
        return { error: 'Social authentication not implemented' };
    }

    async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
        const { email, password } = params;

        // Make API request
        try {
            const response = await login({ username: email, password });

            if (response?.errors) {
                return { error: 'Username hoặc Password không chính xác' };
            }

            const token = response?.data.token;
            const refreshToken = response?.data.refreshToken;

            if (!token || !refreshToken) {
                return { error: 'Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại hoặc liên hệ với người phụ trách' };
            }
            localStorage.setItem('custom-auth-token', token);
            localStorage.setItem('custom-auth-refresh-token', refreshToken);
            return {};
        } catch (error) {
            return { error: "Something wen't wrong" };
        }
    }

    async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
        return { error: 'Password reset not implemented' };
    }

    async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
        return { error: 'Update reset not implemented' };
    }

    async getUser(): Promise<{ data?: User | null; error?: string }> {
        // We do not handle the API, so just check if we have a token in localStorage.
        const token = localStorage.getItem('custom-auth-token');

        if (!token) {
            return { data: null };
        }

        const response = await profilePoper();

        if (!response || !response.data) {
            return { data: null };
        }

        const { data } = response;

        return { data };
    }

    async signOut(): Promise<{ error?: string }> {
        localStorage.removeItem(keysLocalStorage.token);
        localStorage.removeItem(keysLocalStorage.refresh);

        return {};
    }
}

export const authClient = new AuthClient();
