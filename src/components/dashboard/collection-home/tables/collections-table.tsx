'use client';

import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Checkbox from '@mui/material/Checkbox';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';
import { useSelection } from '@/hooks/use-selection';
import { IBaseApi, IPagination, IRowCollection } from '../../../../../interface';
import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr';
import Pagination from '@/components/tables/pagination';
import useHandlePagination from '@/hooks/use-handle-pagination';
import useGetCurrentPage from '@/hooks/use-get-current-page';
import { toast } from 'react-toastify';
import { useConfirm } from 'material-ui-confirm';
import { CircularProgress } from '@mui/material';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import RowCollections from './row-collections';
import { authClient } from '@/lib/auth/client';

interface CollectionHomeTableProps {
    data: IPagination<IRowCollection>;
    loading?: boolean;
    onNext?: (data: IPagination<any>['meta']) => void;
    onPrev?: (data: IPagination<any>['meta']) => void;
    deleteFN?: (selectd: string[]) => Promise<IBaseApi<any> | null>;
    onDeleteSuccess?: () => void;
    onUpdateSucess?: () => void;
}

export function CollectionHomeTable({ data, loading, onNext, onPrev, deleteFN, onDeleteSuccess, onUpdateSucess }: CollectionHomeTableProps): React.JSX.Element {
    const { countIndex } = useGetCurrentPage();
    const confirm = useConfirm();

    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);

    const rowIds = React.useMemo(() => {
        return data.items.map((customer) => customer.id + '');
    }, [data]);

    const { selectAll, deselectAll, selectOne, deselectOne, selected } = useSelection<string>(rowIds);

    const selectedSome = (selected?.size ?? 0) > 0 && (selected?.size ?? 0) < data.items.length;
    const selectedAll = data.items.length > 0 && selected?.size === data.items.length;

    const handleDeletes = async () => {
        if (!deleteFN || selected.size <= 0) return;

        await confirm({ confirmationButtonProps: { autoFocus: true }, title: `Bạn muốn xóa ${selected.size} ảnh`, description: 'Ảnh bị xóa sẽ không thể khôi phục' })
            .then(async () => {
                setIsLoading(true);

                const response = await deleteFN(Array.from(selected));
                if (!response) return toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');

                setIsLoading(false);

                if (response.status && response.code === 403) {
                    return toast.error('Bạn không có quyền sử dụng chức năng này');
                }
                if (response.status && response.code === 402) {
                    return;
                }

                if (onDeleteSuccess) {
                    onDeleteSuccess();
                }
                return toast.success('Xóa thành công');
            })
            .catch(() => {});
    };

    return (
        <div className="flex flex-col gap-2">
            <span className="py-1 text-sm text-gray-400 pl-1 italic">Click to title item to show edit</span>

            <Card
                sx={{
                    position: 'relative',
                }}
            >
                <Box sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: '800px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        checked={selectedAll}
                                        indeterminate={selectedSome}
                                        onChange={(event) => {
                                            if (event.target.checked) {
                                                selectAll();
                                            } else {
                                                deselectAll();
                                            }
                                        }}
                                    />
                                </TableCell>
                                <TableCell>No</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Create by</TableCell>
                                <TableCell>Created At</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.items.map((row, index) => {
                                const isSelected = selected?.has(row.id + '');

                                return (
                                    <RowCollections
                                        key={row.id}
                                        onUpdateSucess={onUpdateSucess}
                                        data={row}
                                        selectOne={selectOne}
                                        isSelected={isSelected}
                                        deselectOne={deselectOne}
                                        index={index}
                                    />
                                );
                            })}
                        </TableBody>
                    </Table>
                </Box>
                <Divider />

                {(loading || isLoading) && (
                    <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,.4)]">
                        <CircularProgress />
                    </div>
                )}

                <Pagination onDeletes={selected.size > 0 ? handleDeletes : undefined} data={data.meta} onNext={onNext} onPrev={onPrev} />
            </Card>
        </div>
    );
}
