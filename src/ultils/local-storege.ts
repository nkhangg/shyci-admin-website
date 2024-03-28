const tokenKey = 'token';

export const keysLocalStorage = {
    token: 'custom-auth-token',
    refresh: 'custom-auth-refresh-token',
};

export const getToken = () => {
    const token = localStorage.getItem(tokenKey);

    if (!token) return undefined;

    return token;
};

export const getConfig = (key: string) => {
    return localStorage.getItem(key);
};

export const setConfig = (key: string, value: string) => {
    return localStorage.setItem(key, value);
};
