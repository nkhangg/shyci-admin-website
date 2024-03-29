import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export interface ICustomerLayoutProps {
    children: ReactNode;
}

export const metadata = { title: `Admins | Dashboard ` } satisfies Metadata;

export default function CustomerLayout({ children }: ICustomerLayoutProps) {
    return <>{children}</>;
}
