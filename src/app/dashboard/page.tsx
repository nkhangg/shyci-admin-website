'use client';
import React, { useMemo } from 'react';
import type { Metadata } from 'next';
import Grid from '@mui/material/Unstable_Grid2';
import { config } from '@/config';
import { Budget } from '@/components/dashboard/overview/budget';
import { LatestOrders } from '@/components/dashboard/overview/latest-orders';
import { LatestProducts } from '@/components/dashboard/overview/latest-products';
import { Sales } from '@/components/dashboard/overview/sales';
import { TasksProgress } from '@/components/dashboard/overview/tasks-progress';
import { TotalCustomers } from '@/components/dashboard/overview/total-customers';
import { TotalProfit } from '@/components/dashboard/overview/total-profit';
import { Traffic } from '@/components/dashboard/overview/traffic';
import ChartsDashboard from '@/components/dashboard/overview/charts-dashboard';
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/apis/handlers/admins';
import { toast } from 'react-toastify';
import { toCurrency } from '@/ultils/funtions';

// export const metadata = { title: `Overview | Dashboard | ${config.site.name}` } satisfies Metadata;

export default function Page(): React.JSX.Element {
    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ['get-dashboard-home'],
        queryFn: getDashboard,
    });

    const dataMemo = useMemo(() => {
        if (!data?.data) return null;

        return data.data;
    }, [data]);

    if (!data?.data && isError) {
        toast.error(data?.message);
        return <span></span>;
    }

    return (
        <Grid container spacing={3}>
            <Grid lg={3} sm={6} xs={12}>
                <Budget
                    diff={dataMemo?.budget?.evolution || 0}
                    trend={(dataMemo?.budget?.evolution || 0) < 0 ? 'down' : 'up'}
                    sx={{ height: '100%' }}
                    value={toCurrency(dataMemo?.budget?.value || 0)}
                />
            </Grid>
            <Grid lg={3} sm={6} xs={12}>
                <TotalCustomers
                    diff={dataMemo?.cutomers?.evolution || 0}
                    trend={(dataMemo?.cutomers?.evolution || 0) < 0 ? 'down' : 'up'}
                    sx={{ height: '100%' }}
                    value={dataMemo?.cutomers?.value + '' || '0'}
                />
            </Grid>
            <Grid lg={3} sm={6} xs={12}>
                <TasksProgress sx={{ height: '100%' }} value={dataMemo?.tasks?.evolution || 0} />
            </Grid>
            <Grid lg={3} sm={6} xs={12}>
                <TotalProfit sx={{ height: '100%' }} value={toCurrency(dataMemo?.totalProfit?.value || 0)} />
            </Grid>
            <Grid lg={12} xs={12}>
                <Sales sync={refetch} chartSeries={dataMemo?.charts || []} sx={{ height: '100%' }} />
            </Grid>
            {/* <Grid lg={4} md={6} xs={12}>
            <Traffic chartSeries={[63, 15, 22]} labels={['Desktop', 'Tablet', 'Phone']} sx={{ height: '100%' }} />
        </Grid> */}
            <Grid lg={4} md={6} xs={12}>
                <LatestProducts sx={{ height: 'fit-content' }} />
            </Grid>
            <Grid lg={8} md={12} xs={12}>
                <LatestOrders filter={{ limit: 6 }} sx={{ height: '100%' }} />
            </Grid>
        </Grid>
    );
}
