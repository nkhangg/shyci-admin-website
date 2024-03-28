'use client';
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput, Popper, TableCell, TableRow } from '@mui/material';
import React, { MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';
import { z as zod } from 'zod';
import { IDropdownData } from '../../../../interface';
import { Controller, useForm } from 'react-hook-form';
import dayjs from 'dayjs';
import useGetCurrentPage from '@/hooks/use-get-current-page';
import { useConfirm } from 'material-ui-confirm';
import { zodResolver } from '@hookform/resolvers/zod';
import { ClockClockwise, Trash } from '@phosphor-icons/react/dist/ssr';
import { toast } from 'react-toastify';
import { deleteCategories, restoreCategories, updateCategories } from '@/apis/handlers/categories';

const schema = zod.object({
    title: zod.string().min(1, { message: 'Tên của danh mục là bắt buộc' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { title: '' } satisfies Values;

export interface IRowCategoriesProps {
    index: number;
    data: IDropdownData;
    deleteMode?: boolean;
    onUpdateSucess?: () => void;
}

export default function RowCategories({ data, index, deleteMode, onUpdateSucess }: IRowCategoriesProps) {
    const { countIndex } = useGetCurrentPage();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [isPending, setIsPending] = useState(false);

    const confirm = useConfirm();

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popper' : undefined;

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    useEffect(() => {
        if (!data) return;

        setValue('title', data.name);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const handleClose = (e: MouseEvent<any>) => {
        e.stopPropagation();
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            if (!data.id || Number.isNaN(data.id)) {
                toast.warn('Id không tồn tại');
                return;
            }
            await confirm({
                confirmationButtonProps: { autoFocus: true },
                title: `Bạn muốn cập nhật tên của danh mục này`,
            })
                .then(async () => {
                    try {
                        setIsPending(true);
                        const response = await updateCategories(Number(data.id), values.title);
                        if (!response) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }
                        if (response.status && response.code === 403) {
                            toast.error('Bạn không có quyền sử dụng chức năng này');
                            return;
                        }
                        if (response.code !== 200) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }
                        toast.success('Cập nhật thành công');
                        setAnchorEl(null);
                        if (onUpdateSucess) {
                            onUpdateSucess();
                        }
                    } catch (error) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                    } finally {
                        setIsPending(false);
                    }
                })
                .catch(() => {});
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    const handleDeleteCategories = async () => {
        if (!data.id || Number.isNaN(data.id)) {
            toast.warn('Id không tồn tại');
            return;
        }
        await confirm({
            confirmationButtonProps: { autoFocus: true },
            title: !deleteMode ? `Bạn muốn xóa danh mục này ?` : 'Bạn muốn khôi phục danh mục này',
            description: 'Bạn sẽ không thể tạo thêm sản phẩm với danh mục này nữa',
        })
            .then(async () => {
                try {
                    setIsPending(true);
                    const response = await (deleteMode ? restoreCategories(Number(data.id)) : deleteCategories(Number(data.id)));
                    if (!response) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                        return;
                    }
                    if (response.status && response.code === 403) {
                        toast.error('Bạn không có quyền sử dụng chức năng này');
                        return;
                    }
                    if (response.code !== 200) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                        return;
                    }
                    toast.success(!deleteMode ? 'Xóa thành công' : 'Khôi phục thành công');
                    setAnchorEl(null);
                    if (onUpdateSucess) {
                        onUpdateSucess();
                    }
                } catch (error) {
                    toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                } finally {
                    setIsPending(false);
                }
            })
            .catch(() => {});
    };

    return (
        <TableRow key={data.id} hover>
            <TableCell>{countIndex(index)}</TableCell>
            <TableCell>
                <span className="select-none py-4" onClick={handleClick}>
                    {data.name}
                </span>

                <Popper onClick={(e) => e.stopPropagation()} id={id} open={open} anchorEl={anchorEl} placement="bottom">
                    <form onSubmit={handleSubmit(onSubmit)} className="py-4 bg-white shadow-xl flex items-center justify-center flex-col gap-4 px-4 rounded border border-gray-400">
                        <Controller
                            control={control}
                            name="title"
                            render={({ field }) => (
                                <FormControl
                                    sx={{
                                        width: '100%',
                                    }}
                                    error={Boolean(errors.title)}
                                >
                                    <InputLabel>Tên danh mục</InputLabel>
                                    <OutlinedInput {...field} label="Tên danh mục" type="text" />
                                    {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />

                        <div className="w-full flex items-center justify-end gap-2">
                            <Button size="small" onClick={handleClose} variant="contained" color="secondary">
                                Close
                            </Button>
                            <Button size="small" type="submit" variant="contained">
                                Update
                            </Button>
                        </div>
                    </form>
                </Popper>
            </TableCell>
            <TableCell>{dayjs(data.createdAt).format('MMM D, YYYY')}</TableCell>
            <TableCell align="center">
                {!deleteMode && (
                    <Button onClick={handleDeleteCategories}>
                        <Trash />
                    </Button>
                )}
                {deleteMode && (
                    <Button onClick={handleDeleteCategories}>
                        <ClockClockwise />
                    </Button>
                )}
            </TableCell>
        </TableRow>
    );
}
