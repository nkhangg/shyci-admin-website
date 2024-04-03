'use client';
import React, { MutableRefObject, RefObject, useImperativeHandle, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardHeader from '@mui/material/CardHeader';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import RouterLink from 'next/link';
import type { SxProps } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { ArrowRight, ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import dayjs from 'dayjs';
import { IFilterOrder, IOrder, IRefOders } from '../../../../interface';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/apis/handlers/orders';
import { paths } from '@/paths';
import Link from 'next/link';
import useDebounce from '@/hooks/useDebounce';
import OrdersFilters from '../products/filters/orders-filters';
import useHandlePagination from '@/hooks/use-handle-pagination';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
import NotFound from '@/components/erorrs/not-found';
import { IconButton, Tooltip } from '@mui/material';
import { CreditCard } from '@phosphor-icons/react/dist/ssr';
import { OrderService } from '@/ultils/services/orders.service';
import { useConfirm } from 'material-ui-confirm';
import useGetCurrentPage from '@/hooks/use-get-current-page';

const statusMap = {
    pending: { label: 'Pending', color: 'warning' },
    delivered: { label: 'Delivered', color: 'success' },
    refunded: { label: 'Refunded', color: 'error' },
} as const;

export interface LatestOrdersProps {
    filter?: IFilterOrder;
    title?: string;
    sx?: SxProps;
    options?: {
        showall?: boolean;
        showLink?: boolean;
        filter?: boolean;
        showComfrimOrder?: boolean;
    };
}

export function LatestOrders({
    sx,
    title = 'Latest orders',
    options = { showall: true, showLink: false, filter: false, showComfrimOrder: false },
}: LatestOrdersProps): React.JSX.Element {
    const [filters, setFilters] = useState<IFilterOrder>({});

    const { countIndex } = useGetCurrentPage();

    const baseUrl = paths.dashboard.orders;

    const comfirm = useConfirm();

    const { page, handleNext, handlePrev } = useHandlePagination({ baseUrl });

    const searchD = useDebounce(filters.search || '', 800);

    const { data, isLoading, refetch } = useQuery({
        queryKey: ['get orders', page, { ...filters, search: searchD }],
        queryFn: () => getOrders({ ...filters, page, search: searchD as string }),
    });

    const orders = useMemo(() => {
        if (!data || !data.items) return [] as IOrder[];

        return data.items;
    }, [data]);

    return (
        <>
            {options.filter && (
                <OrdersFilters
                    filters={filters}
                    onSearch={(e) => setFilters({ ...filters, search: e })}
                    onSort={(e) => setFilters({ ...filters, sort: e })}
                    onDate={({ min, max }) => setFilters({ ...filters, min, max })}
                    onState={(e) => setFilters({ ...filters, state: e })}
                    onClear={() => setFilters({})}
                    pagination={{ data: data?.meta, onNext: handleNext, onPrev: handlePrev }}
                />
            )}

            <Card sx={sx}>
                <CardHeader title={title} />
                <Divider />
                {orders.length > 0 && !isLoading && (
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: 800 }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Order</TableCell>
                                    <TableCell>Customer</TableCell>
                                    <TableCell sortDirection="desc">Date</TableCell>
                                    <TableCell>Status</TableCell>
                                    {options.showLink && <TableCell>Action</TableCell>}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.map((order, index) => {
                                    const { label, color } = statusMap[order.state] ?? { label: 'Unknown', color: 'default' };

                                    return (
                                        <TableRow hover key={order.id}>
                                            <TableCell>{countIndex(index)}</TableCell>
                                            <TableCell>#{order.id}</TableCell>
                                            <TableCell>{order.fullname}</TableCell>
                                            <TableCell>{dayjs(order.createdAt).format('MMM D, YYYY')}</TableCell>
                                            <TableCell>
                                                <Chip color={color} label={label} size="small" />
                                            </TableCell>
                                            {(options.showComfrimOrder || options.showLink) && (
                                                <TableCell align="right">
                                                    <div className="flex items-center gap-4">
                                                        {options.showComfrimOrder && (
                                                            <Tooltip title={'Xác nhận thanh toán'}>
                                                                <Button
                                                                    onClick={() => OrderService.handleComfrimOrder(order, comfirm, refetch)}
                                                                    disabled={!!order.detail?.payAt || ['refunded', 'pending'].includes(order.state)}
                                                                    variant="contained"
                                                                >
                                                                    <CreditCard />
                                                                </Button>
                                                            </Tooltip>
                                                        )}

                                                        {options.showLink && (
                                                            <Tooltip title={'Chi tiết đơn hàng'}>
                                                                <Button component={RouterLink} href={paths.dashboard.orders + `/${order.id}`}>
                                                                    <ArrowRight weight="bold" />
                                                                </Button>
                                                            </Tooltip>
                                                        )}
                                                    </div>
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                )}

                {orders.length <= 0 && !isLoading && <NotFound />}
                <Divider />
                {options.showall && (
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button
                            component={RouterLink}
                            href={paths.dashboard.orders}
                            color="inherit"
                            endIcon={<ArrowRightIcon fontSize="var(--icon-fontSize-md)" />}
                            size="small"
                            variant="text"
                        >
                            View all
                        </Button>
                    </CardActions>
                )}
            </Card>

            {isLoading && <FullpageLoading />}
        </>
    );
}
