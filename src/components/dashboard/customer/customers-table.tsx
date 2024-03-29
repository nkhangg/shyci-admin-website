'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { IDCustomer } from '../../../../interface';
import useGetCurrentPage from '@/hooks/use-get-current-page';
import NotFound from '@/components/erorrs/not-found';

interface CustomersTableProps {
    data: IDCustomer[];
}

export function CustomersTable({ data }: CustomersTableProps): React.JSX.Element {
    const { countIndex } = useGetCurrentPage();

    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Tên đăng nhập</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Địa chỉ mua hàng gần nhất</TableCell>
                            <TableCell>Số điện thoại</TableCell>
                            <TableCell>Ngày tham gia</TableCell>
                        </TableRow>
                    </TableHead>
                    {data.length > 0 && (
                        <TableBody>
                            {data.map((row, index) => {
                                return (
                                    <TableRow hover key={row.id}>
                                        <TableCell padding="checkbox">{countIndex(index)}</TableCell>

                                        <TableCell>{row.username}</TableCell>
                                        <TableCell>{row.email}</TableCell>
                                        <TableCell>
                                            {[!!row.address, !!row.ward, !!row.district, !!row.province].includes(true)
                                                ? `${row.address}, ${row.ward}, ${row.district}, ${row.province}`
                                                : 'Chưa cập nhật'}
                                        </TableCell>
                                        <TableCell>{row.phone || 'Chưa cập nhật'}</TableCell>
                                        <TableCell>{dayjs(row.createdAt).format('DD/MM/YYYY')}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    )}
                </Table>
                {data.length <= 0 && (
                    <div className="flex items-center justify-center">
                        <NotFound />
                    </div>
                )}
            </Box>
        </Card>
    );
}
