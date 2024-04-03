import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export interface ICategoriesLayoutProps {
    children: ReactNode;
}

export const metadata = { title: `Categories | Dashboard ` } satisfies Metadata;

export default function CategoriesLayout({ children }: ICategoriesLayoutProps) {
    return <>{children}</>;
}
