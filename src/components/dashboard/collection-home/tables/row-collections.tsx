'use client';
import useGetCurrentPage from '@/hooks/use-get-current-page';
import { Avatar, Box, Button, Checkbox, FormControl, FormHelperText, InputLabel, OutlinedInput, Popper, Stack, TableCell, TableRow } from '@mui/material';
import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { IRowCollection } from '../../../../../interface';
import dayjs from 'dayjs';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'react-toastify';
import { updateCollections } from '@/apis/handlers/collections';
import { useConfirm } from 'material-ui-confirm';

const schema = zod.object({
    title: zod.string().min(1, { message: 'Title is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { title: '' } satisfies Values;

export interface IRowCollectionsProps {
    isSelected: boolean;
    data: IRowCollection;
    index: number;
    selectOne: (key: string) => void;
    deselectOne: (key: string) => void;
    onUpdateSucess?: () => void;
}

export default function RowCollections({ isSelected, data, index, selectOne, deselectOne, onUpdateSucess }: IRowCollectionsProps) {
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

        setValue('title', data.title);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data]);

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            if (!data.id || Number.isNaN(data.id)) {
                toast.warn('Id không tồn tại');
                return;
            }

            await confirm({ confirmationButtonProps: { autoFocus: true }, title: `Bạn muốn update title ảnh`, description: 'Chỉ title của ảnh được update. Không thể update ảnh' })
                .then(async () => {
                    try {
                        setIsPending(true);

                        const response = await updateCollections({ id: data.id + '', title: values.title });

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

                        toast.success('Update thành công');

                        setAnchorEl(null);

                        if (onUpdateSucess) {
                            onUpdateSucess();
                        }
                    } catch (error) {
                    } finally {
                        setIsPending(false);
                    }
                })
                .catch(() => {});
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data.id],
    );

    const handleClose = (e: MouseEvent<any>) => {
        e.stopPropagation();
        setAnchorEl(null);
    };

    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };
    return (
        <TableRow onClick={handleClose} hover selected={isSelected}>
            <TableCell padding="checkbox">
                <Checkbox
                    onClick={(e) => {}}
                    checked={isSelected}
                    onChange={(event) => {
                        if (event.target.checked) {
                            selectOne(data.id + '');
                        } else {
                            deselectOne(data.id + '');
                        }
                    }}
                />
            </TableCell>
            <TableCell>{countIndex(index)}</TableCell>
            <TableCell>
                <Stack sx={{ alignItems: 'center' }} direction="row" spacing={2}>
                    <Avatar
                        sx={{
                            width: '80px',
                            height: '80px',
                        }}
                        variant="rounded"
                        src={data.image}
                    />
                </Stack>
            </TableCell>
            <TableCell>
                <span className="select-none py-4" onClick={handleClick}>
                    {data.title}
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
                                    <InputLabel>Title</InputLabel>
                                    <OutlinedInput {...field} label="title" type="text" />
                                    {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />

                        <div className="w-full flex items-center justify-end gap-2">
                            <Button onClick={handleClose} variant="contained" color="secondary">
                                Close
                            </Button>
                            <Button type="submit" variant="contained">
                                Update
                            </Button>
                        </div>
                    </form>
                </Popper>
            </TableCell>
            <TableCell>{data.user.fullname}</TableCell>
            <TableCell>{dayjs(data.createdAt).format('MMM D, YYYY')}</TableCell>
        </TableRow>
    );
}
