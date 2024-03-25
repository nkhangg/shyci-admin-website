import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export interface IProductPageLayoutProps {
    children: ReactNode;
}

export const metadata = { title: `Products | Dashboard` } satisfies Metadata;

export default function ProductPageLayout({ children }: IProductPageLayoutProps) {
    return <>{children}</>;
}
