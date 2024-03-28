'use client';

import * as React from 'react';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import type { ApexOptions } from 'apexcharts';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { Chart } from '@/components/core/chart';
import CustomBox from '@/components/common/boxs/custom-box';
import dayjs from 'dayjs';
import { Button } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getChartProduct } from '@/apis/handlers/products';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';

export interface SalesProps {
    id: string;
    sx?: SxProps;
}

export function OverviewProduct({ sx, id }: SalesProps): React.JSX.Element {
    const chartOptions = useChartOptions();

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-chart', id],
        queryFn: () => getChartProduct(id),
    });

    const dataMemo = React.useMemo(() => {
        if (!data?.data) return [];

        return data.data;
    }, [data]);

    return (
        <CustomBox
            title="Tổng quan"
            classnames={{
                parent: 'relative overflow-hidden',
            }}
        >
            <div className="flex items-center justify-end ">
                <Button onClick={() => refetch()} color="inherit" size="small" startIcon={<ArrowClockwiseIcon fontSize="var(--icon-fontSize-md)" />}>
                    Sync
                </Button>
            </div>
            <Chart height={350} options={chartOptions} series={dataMemo} type="line" width="100%" />

            {isLoading && <FullpageLoading />}
        </CustomBox>
    );
}

function useChartOptions(): ApexOptions {
    const theme = useTheme();

    return {
        chart: {
            type: 'line',
            toolbar: {
                show: false,
            },
        },
        colors: [theme.palette.primary.main, theme.palette.success.main, theme.palette.warning.main],
        dataLabels: {
            enabled: true,
        },
        stroke: {
            curve: 'smooth',
        },

        markers: {
            size: 1,
        },
        xaxis: {
            categories: Array.from({ length: 12 }).map((item, index) => `Tháng ${index + 1}`),
        },
    };
}
