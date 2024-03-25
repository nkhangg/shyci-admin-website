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
