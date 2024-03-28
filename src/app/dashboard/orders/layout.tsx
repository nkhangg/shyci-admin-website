import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export interface IOrderLayoutProps {
    children: ReactNode;
}

export const metadata = { title: `Orders | Dashboard` } satisfies Metadata;

export default function OrderLayout({ children }: IOrderLayoutProps) {
    return <>{children}</>;
}
