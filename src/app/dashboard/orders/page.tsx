'use client';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import React, { useRef } from 'react';
import { IRefOders } from '../../../../interface';

export interface IOrdersPageProps {}

export default function OrdersPage(props: IOrdersPageProps) {
    return (
        <section className="flex flex-col gap-8">
            <LatestOrders title="Danh sách đơn hàng" options={{ showall: false, showLink: true, filter: true, showComfrimOrder: true }} sx={{ height: '100%' }} />
        </section>
    );
}
