import { Metadata } from 'next';
import React from 'react';

export interface ICollectionHomeLayoutProps {
    children: React.ReactNode;
}

export const metadata = { title: `Collection home | Dashboard` } satisfies Metadata;

export default function CollectionHomeLayout({ children }: ICollectionHomeLayoutProps) {
    return <>{children}</>;
}
