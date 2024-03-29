'use client';
import React, { useMemo, useState } from 'react';
import type { Metadata } from 'next';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Download as DownloadIcon } from '@phosphor-icons/react/dist/ssr/Download';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { Upload as UploadIcon } from '@phosphor-icons/react/dist/ssr/Upload';
import dayjs from 'dayjs';
import { config } from '@/config';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { useQuery } from '@tanstack/react-query';
import { getCustomer } from '@/apis/handlers/customer';
import { IFilter } from '../../../../interface';
import { paths } from '@/paths';
import { useConfirm } from 'material-ui-confirm';
import useHandlePagination from '@/hooks/use-handle-pagination';
import useDebounce from '@/hooks/useDebounce';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
import { useRouter } from 'next/navigation';

export default function Page(): React.JSX.Element {
    const router = useRouter();

    const [filters, setFilters] = useState<IFilter>({});

    const baseUrl = paths.dashboard.customers;

    const comfirm = useConfirm();

    const { page, handleNext, handlePrev } = useHandlePagination({ baseUrl });

    const searchD = useDebounce(filters.search || '', 800);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-customer', page, { ...filters, search: searchD }],
        queryFn: () => getCustomer({ ...filters, page, search: searchD as string }),
    });

    const dataMemo = useMemo(() => {
        if (!data?.items) return [];

        return data.items;
    }, [data]);

    return (
        <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
                <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                    <Typography variant="h4">Customers</Typography>
                </Stack>
            </Stack>
            <CustomersFilters
                pagination={{ data: data?.meta, onNext: handleNext, onPrev: handlePrev }}
                filters={filters}
                onSort={(e) => setFilters({ ...filters, sort: e })}
                onSearch={(e) => {
                    if (page) {
                        router.push(baseUrl);
                    }

                    setFilters({ ...filters, search: e });
                }}
            />
            <CustomersTable data={dataMemo} />

            {isLoading && <FullpageLoading />}
        </Stack>
    );
}
