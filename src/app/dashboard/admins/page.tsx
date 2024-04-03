'use client';
import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { Button, Typography } from '@mui/material';
import { Stack } from '@mui/system';
import { useRouter } from 'next/navigation';
import React, { useMemo, useState } from 'react';
import { IFilter } from '../../../../interface';
import { paths } from '@/paths';
import { useConfirm } from 'material-ui-confirm';
import useHandlePagination from '@/hooks/use-handle-pagination';
import useDebounce from '@/hooks/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { getCustomer } from '@/apis/handlers/customer';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
import AdminTable from '@/components/dashboard/admins/admin-table';
import { getAdmins } from '@/apis/handlers/admins';
import Link from 'next/link';

export interface IAdminsPageProps {}

export default function AdminsPage(props: IAdminsPageProps) {
    const router = useRouter();

    const [filters, setFilters] = useState<IFilter>({});

    const [loading, setLoading] = useState(false);

    const baseUrl = paths.dashboard.admins;

    const { page, handleNext, handlePrev } = useHandlePagination({ baseUrl });

    const searchD = useDebounce(filters.search || '', 800);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get-admins', page, { ...filters, search: searchD }],
        queryFn: () => getAdmins({ ...filters, page, search: searchD as string }),
    });

    const dataMemo = useMemo(() => {
        if (!data?.items) return [];

        return data.items;
    }, [data]);

    return (
        <section>
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Admins</Typography>
                    </Stack>

                    <Button component={Link} href={paths.dashboard.admins + '/create'} variant="contained">
                        Tạo mới
                    </Button>
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

                <AdminTable setLoading={setLoading} handleWhenSuccess={refetch} data={dataMemo} />

                {(isLoading || loading) && <FullpageLoading />}
            </Stack>
        </section>
    );
}
