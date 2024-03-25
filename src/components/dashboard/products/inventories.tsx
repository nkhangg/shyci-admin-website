'use client';
import React, { MutableRefObject, RefObject, useCallback, useEffect, useImperativeHandle, useRef, useState } from 'react';
import Dropdown from '@/components/inputs/dropdown';
import InputIcon from '@/components/inputs/input-icon';
import { Button, Checkbox, FormControl, FormControlLabel, FormHelperText } from '@mui/material';
import { Money, Storefront, Tag } from '@phosphor-icons/react/dist/ssr';
import { Controller, useForm } from 'react-hook-form';
import { z as zod } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { constants } from '@/components/common/constants';
import { ISize } from '../../../../interface';
import { v4 as uuid } from 'uuid';

const schema = zod.object({
    name: zod.string().min(1, { message: 'Size là bắt buộc' }),
    price: zod.number().min(1, { message: 'Giá trị sản phẩm của size là bắt buộc' }),
    store: zod.number().min(1, { message: 'Sản phẩm trong kho không phù hợp' }),
    discount: zod.number().min(0, { message: 'Giảm giá không phù hợp' }).max(100, { message: 'Giảm giá phải nhỏ hơn hoặc bằng 100' }),
});

type Values = zod.infer<typeof schema>;

export interface IInventoriesProps {
    currentInventories: ISize[];
    displayData?: ISize;
    onAddSize?: (data: ISize) => void;
    refChild?: MutableRefObject<{ reset: () => void }>;
}

export default function Inventories({ currentInventories, displayData, refChild, onAddSize }: IInventoriesProps) {
    const [applayGlobalDiscout, setApplayGlobalDiscout] = useState<boolean>(true);

    const defaultValues = { price: 0, store: 0, discount: 0, name: 'S' } satisfies Values;
    const prevDiscount = useRef(defaultValues.discount);

    const {
        control,
        handleSubmit,
        setError,
        reset,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    useImperativeHandle(refChild, () => {
        return {
            reset: () => {
                prevDiscount.current = 0;
                reset({ discount: 0 });
            },
        };
    });

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            if (!onAddSize) return;

            if (currentInventories.length && currentInventories.find((inventory) => inventory.name === values.name) && !displayData) {
                setError('name', { message: 'Size đã tồn tại trong kho. Hãy chắt rằng bạn không nhầm' });
                return;
            }

            onAddSize({
                id: uuid(),
                ...values,
            } as ISize);

            if (applayGlobalDiscout) {
                prevDiscount.current = values.discount;
                reset({ discount: prevDiscount.current });
                return;
            }
            reset({ discount: 0 });
        },
        [applayGlobalDiscout, currentInventories, displayData, onAddSize, reset, setError],
    );

    useEffect(() => {
        if (!displayData) return;

        requestIdleCallback(() => {
            Object.keys(displayData).forEach((item) => {
                const key = item as keyof ISize;

                if (key === 'id') return;

                setValue(key as 'name' | 'price' | 'store' | 'discount', displayData[key]);
            });
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [displayData]);
    return (
        <div className="flex flex-col gap-4">
            <div className="">
                <FormControlLabel
                    checked={applayGlobalDiscout}
                    onClick={() => setApplayGlobalDiscout(!applayGlobalDiscout)}
                    sx={{
                        '& .MuiTypography-root': {
                            fontSize: '14px',
                            fontStyle: 'italic',
                            userSelect: 'none',
                        },
                    }}
                    control={<Checkbox size="small" defaultChecked />}
                    label={`Áp dụng giảm giá ${applayGlobalDiscout ? `(${prevDiscount.current}%)` : ''} cho các kho khác`}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="price"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.price)} sx={{ width: '100%' }}>
                            <InputIcon icon={<Money />} {...field} type="number" onChange={(e) => field.onChange(e.target.valueAsNumber)} title="Giá cơ bản" />
                            {errors.price ? <FormHelperText>{errors.price.message}</FormHelperText> : null}
                        </FormControl>
                    )}
                />
                <Controller
                    control={control}
                    name="store"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.store)} sx={{ width: '100%' }}>
                            <InputIcon type="number" icon={<Storefront />} {...field} onChange={(e) => field.onChange(e.target.valueAsNumber)} title="Kho" />
                            {errors.store ? <FormHelperText>{errors.store.message}</FormHelperText> : null}
                        </FormControl>
                    )}
                />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <Controller
                    control={control}
                    name="discount"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.discount)} sx={{ width: '100%' }}>
                            <InputIcon
                                icon={<Tag />}
                                {...field}
                                disabled={applayGlobalDiscout && prevDiscount.current > 0}
                                type="number"
                                title="Giảm giá"
                                onChange={(e) => field.onChange(e.target.valueAsNumber)}
                            />
                            {errors.discount ? <FormHelperText>{errors.discount.message}</FormHelperText> : null}
                        </FormControl>
                    )}
                />
                <Controller
                    control={control}
                    name="name"
                    render={({ field }) => (
                        <FormControl error={Boolean(errors.name)} sx={{ width: '100%' }}>
                            <Dropdown {...field} data={constants.sizes} title="Size" />
                            {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                        </FormControl>
                    )}
                />
            </div>

            <div className="w-full flex items-center justify-end">
                <Button onClick={handleSubmit(onSubmit)} variant="contained">
                    Tạo kho
                </Button>
            </div>
        </div>
    );
}
