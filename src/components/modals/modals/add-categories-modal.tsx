import React, { useCallback, useState } from 'react';
import BaseModal from './base-modal';
import { z as zod } from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { zodResolver } from '@hookform/resolvers/zod';
import { useConfirm } from 'material-ui-confirm';
import { createCategories } from '@/apis/handlers/categories';
import { toast } from 'react-toastify';

const schema = zod.object({
    title: zod.string().min(1, { message: 'Tên của danh mục là bắt buộc' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { title: '' } satisfies Values;

export interface IAddCategoriesModalProps {
    open: boolean;
    setOpen: (v: boolean) => void;
    onUpdateSucess?: () => void;
}

export default function AddCategoriesModal({ open, setOpen, onUpdateSucess }: IAddCategoriesModalProps) {
    const {
        control,
        handleSubmit,
        setError,
        setValue,
        reset,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const [isPending, setIsPending] = useState(false);

    const confirm = useConfirm();

    const handleClose = () => {
        setOpen(false);
        reset();
    };

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            await confirm({ confirmationButtonProps: { autoFocus: true }, title: `Một danh mục mới sẽ được thêm vào hệ thống` })
                .then(async () => {
                    try {
                        setIsPending(true);
                        const response = await createCategories(values.title);
                        if (!response) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }
                        if (response.status && response.code === 403) {
                            toast.error('Bạn không có quyền sử dụng chức năng này');
                            return;
                        }
                        if (response.code !== 201) {
                            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                            return;
                        }
                        toast.success('Update thành công');
                        handleClose();
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

    return (
        <BaseModal title="Thêm một danh mục mới" open={open} setOpen={setOpen}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col justify-between gap-4 mt-8">
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
                        Hủy
                    </Button>
                    <Button size="small" type="submit" variant="contained">
                        Thêm
                    </Button>
                </div>
            </form>
        </BaseModal>
    );
}
