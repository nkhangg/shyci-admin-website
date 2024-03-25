'use client';
import ActionProduct from '@/components/dashboard/products/action-product';
import useGetProduct from '@/hooks/products/use-get-product';
import { paths } from '@/paths';
import { useRouter } from 'next/navigation';
import React, { useRef } from 'react';

export interface IUpdateProductPageProps {
    params: { id: string };
}

export default function UpdateProductPage({ params }: IUpdateProductPageProps) {
    return <ActionProduct mode="update" id={params.id} />;
}
