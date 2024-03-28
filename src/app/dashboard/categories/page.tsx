'use client';
import { Box, Button, Card, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Tooltip, Typography } from '@mui/material';
import RouterLink from 'next/link';
import { Stack } from '@mui/system';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import React, { useMemo, useState } from 'react';
import { paths } from '@/paths';
import { z as zod } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/apis/handlers/categories';
import { toast } from 'react-toastify';
import { IDropdownData, IFilter } from '../../../../interface';
import RowCategories from '@/components/dashboard/categories/row-categories';
import NotFound from '@/components/erorrs/not-found';
import AddCategoriesModal from '@/components/modals/modals/add-categories-modal';
import PermissionDenied from '@/components/erorrs/permission-denied';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';

const schema = zod.object({
    title: zod.string().min(1, { message: 'Tên của danh mục là bắt buộc' }),
});

type Values = zod.infer<typeof schema>;

export interface ICAtegoriesPageProps {}

export default function CAtegoriesPage(props: ICAtegoriesPageProps) {
    const [openModal, setOpenModal] = useState(false);

    const [filters, setFilters] = useState<IFilter>({});

    const { data, isError, isLoading, refetch } = useQuery({
        queryKey: ['get-categories', { ...filters }],
        queryFn: () => getCategories({ ...filters }),
    });

    if (isError && data?.code !== 200) {
        toast.warn('Có lỗi trong quá trình lấy dữ liệu');
    }

    const dataMemo = useMemo(() => {
        if (!data) return [];

        return data.data as IDropdownData[];
    }, [data]);

    const handleFilters = () => {
        if (filters.deleted) {
            setFilters({ ...filters, deleted: false });
        } else {
            setFilters({ deleted: true });
        }
    };

    return (
        <section>
            <Stack spacing={3}>
                <Stack direction="row" spacing={3}>
                    <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
                        <Typography variant="h4">Danh mục sản phẩm</Typography>
                    </Stack>
                    <div className="flex items-center gap-4">
                        <Tooltip title="Xem những danh mục đã xóa">
                            <IconButton onClick={handleFilters}>
                                <div className="hover:text-heart">
                                    <Trash />
                                </div>
                            </IconButton>
                        </Tooltip>
                        <Button onClick={() => setOpenModal(true)} startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
                            Add
                        </Button>
                    </div>
                </Stack>

                <Card
                    sx={{
                        position: 'relative',
                    }}
                >
                    <Box sx={{ overflowX: 'auto' }}>
                        <Table sx={{ minWidth: '800px' }}>
                            <TableHead>
                                <TableRow>
                                    <TableCell>No</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Created at</TableCell>
                                    <TableCell align="center">Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataMemo.map((item, index) => {
                                    return (
                                        <RowCategories
                                            deleteMode={filters.deleted as boolean}
                                            onUpdateSucess={filters.deleted ? handleFilters : refetch}
                                            data={item}
                                            index={index}
                                            key={item.id}
                                        />
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </Box>
                </Card>

                {data?.data && data.data.length <= 0 && <NotFound />}

                {data?.code === 403 && (
                    <div className="my-8">
                        <PermissionDenied />
                    </div>
                )}

                {isLoading && <FullpageLoading />}

                <AddCategoriesModal onUpdateSucess={refetch} open={openModal} setOpen={setOpenModal} />
            </Stack>
        </section>
    );
}
