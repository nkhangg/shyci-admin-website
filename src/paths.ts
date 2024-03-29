export const paths = {
    home: '/',
    auth: { signIn: '/auth/sign-in', signUp: '/auth/sign-up', resetPassword: '/auth/reset-password' },
    dashboard: {
        overview: '/dashboard',
        collectionHome: '/dashboard/collection-home',
        products: '/dashboard/products',
        orders: '/dashboard/orders',
        account: '/dashboard/account',
        categories: '/dashboard/categories',
        customers: '/dashboard/customers',
        admins: '/dashboard/admins',
        integrations: '/dashboard/integrations',
        settings: '/dashboard/settings',
    },
    errors: { notFound: '/errors/not-found' },
} as const;
