export interface User {
    id: string;
    username?: string;
    fullname?: string;
    createdAt?: string;

    [key: string]: unknown;
}
