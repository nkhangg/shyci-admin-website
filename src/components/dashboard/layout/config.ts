import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';

export const navItems = [
    { key: 'overview', title: 'Overview', href: paths.dashboard.overview, icon: 'chart-pie' },
    { key: 'collection-home', title: 'Collection Home', href: paths.dashboard.collectionHome, icon: 'collection-home' },
    { key: 'products', title: 'Products', href: paths.dashboard.products, icon: 'products' },
    { key: 'orders', title: 'Orders', href: paths.dashboard.orders, icon: 'orders' },
    { key: 'categories', title: 'Categories', href: paths.dashboard.categories, icon: 'categories' },
    { key: 'customers', title: 'Customers', href: paths.dashboard.customers, icon: 'users' },
    { key: 'integrations', title: 'Integrations', href: paths.dashboard.integrations, icon: 'plugs-connected' },
    { key: 'settings', title: 'Settings', href: paths.dashboard.settings, icon: 'gear-six' },
    { key: 'account', title: 'Account', href: paths.dashboard.account, icon: 'user' },
    // { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];
