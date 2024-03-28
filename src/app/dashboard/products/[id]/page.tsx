'use client';
import ActionProduct from '@/components/dashboard/products/action-product';
import { OverviewProduct } from '@/components/dashboard/products/chats/over-view-product';
import { getConfig } from '@/ultils/local-storege';
import React, { useMemo, useRef } from 'react';

export interface IUpdateProductPageProps {
    params: { id: string };
}

export default function UpdateProductPage({ params }: IUpdateProductPageProps) {
    const configShowChart = useMemo(() => {
        const result = getConfig('show-chart');

        if (result === null) return true;

        return result === 'true';
    }, []);

    console.log(configShowChart);

    return (
        <section className="flex flex-col gap-8">
            {configShowChart && <OverviewProduct id={params.id} />}
            <ActionProduct mode="update" id={params.id} />
        </section>
    );
}
