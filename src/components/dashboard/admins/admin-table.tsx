'use client';
import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import NotFound from '@/components/erorrs/not-found';
import { IAdmin } from '../../../../interface';
import useGetCurrentPage from '@/hooks/use-get-current-page';
import { Button, Chip } from '@mui/material';
import { ArrowRight, Trash } from '@phosphor-icons/react/dist/ssr';
import { useUser } from '@/hooks/use-user';
import { constants } from '@/components/common/constants';
import Link from 'next/link';
import { paths } from '@/paths';
import ButtonDeleteAdmin from '@/components/common/buttons-colap/button-delete-admin';
export interface IAdminTableProps {
    data: IAdmin[];
    handleWhenSuccess?: () => void;
    setLoading?: (v: boolean) => void;
}

export default function AdminTable({ data, handleWhenSuccess, setLoading }: IAdminTableProps) {
    const { countIndex } = useGetCurrentPage();

    const { user } = useUser();

    return (
        <Card>
            <Box sx={{ overflowX: 'auto' }}>
                <Table sx={{ minWidth: '800px' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>No</TableCell>
                            <TableCell>Tên đầy đủ</TableCell>
                            <TableCell>Tên đăng nhập</TableCell>

                            <TableCell>Quyền thực thi</TableCell>
                            <TableCell>Ngày tạo</TableCell>

                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    {data.length > 0 && (
                        <TableBody>
                            {data.map((row, index) => {
                                return (
                                    <TableRow hover key={row.id}>
                                        <TableCell padding="checkbox">{countIndex(index)}</TableCell>

                                        <TableCell>{row.fullname}</TableCell>
                                        <TableCell>{row.username}</TableCell>

                                        <TableCell>
                                            <div className="flex items-center flex-wrap gap-4">
                                                {row?.authorizations?.map((item) => {
                                                    const { label, color } = constants.rolesMap[item.role.name as 'create' | 'read' | 'edit'] ?? {
                                                        label: 'Unknown',
                                                        color: 'default',
                                                    };

                                                    return (
                                                        <Chip
                                                            sx={{
                                                                textTransform: 'capitalize',
                                                            }}
                                                            color={color as 'default' | 'warning' | 'success' | 'error' | 'primary' | 'secondary' | 'info'}
                                                            key={item.id}
                                                            label={label}
                                                        />
                                                    );
                                                })}
                                            </div>
                                        </TableCell>

                                        <TableCell>{dayjs(row.createdAt).format('DD/MM/YYYY')}</TableCell>

                                        <TableCell align="center">
                                            <ButtonDeleteAdmin loading={setLoading} handleWhenSucess={handleWhenSuccess} data={row} />
                                            <Button component={Link} href={paths.dashboard.admins + `/${row.id}`}>
                                                <ArrowRight />
                                            </Button>
                                        </TableCell>
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
