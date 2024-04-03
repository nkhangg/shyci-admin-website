'use client';
import Grid from '@mui/material/Unstable_Grid2';
import React, { useMemo } from 'react';
import { Budget } from './budget';
import { TotalCustomers } from './total-customers';
import { TasksProgress } from './tasks-progress';
import { TotalProfit } from './total-profit';
import { Sales } from './sales';
import { useQuery } from '@tanstack/react-query';
import { getDashboard } from '@/apis/handlers/admins';
import { toast } from 'react-toastify';
import { toCurrency } from '@/ultils/funtions';

export interface IChartsDashboardProps {}

export default function ChartsDashboard(props: IChartsDashboardProps) {
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
        return null;
    }

    return (
        dataMemo && (
            <Grid container gap={3}>
                <Grid lg={3} sm={6} xs={12}>
                    <Budget diff={dataMemo?.budget?.evolution || 0} trend={(dataMemo?.budget?.evolution || 0) < 0 ? 'down' : 'up'} sx={{ height: '100%' }} value={'1.6k'} />
                </Grid>
                <Grid lg={3} sm={6} xs={12}>
                    <TotalCustomers diff={16} trend="down" sx={{ height: '100%' }} value="1.6k" />
                </Grid>
                <Grid lg={3} sm={6} xs={12}>
                    <TasksProgress sx={{ height: '100%' }} value={75.5} />
                </Grid>
                <Grid lg={3} sm={6} xs={12}>
                    <TotalProfit sx={{ height: '100%' }} value="$15k" />
                </Grid>
                <Grid lg={12} xs={12}>
                    <Sales
                        chartSeries={[
                            { name: 'This year', data: [18, 16, 5, 8, 3, 14, 14, 16, 17, 19, 18, 20] },
                            { name: 'Last year', data: [12, 11, 4, 6, 2, 9, 9, 10, 11, 12, 13, 13] },
                        ]}
                        sx={{ height: '100%' }}
                    />
                </Grid>
            </Grid>
        )
    );
}
