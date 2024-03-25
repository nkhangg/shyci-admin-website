/* eslint-disable @next/next/no-img-element */
import styles from './style.module.css';
import { zodResolver } from '@hookform/resolvers/zod';
import { Avatar, Button, FormControl, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z as zod } from 'zod';
import { ICollectionCreateItem } from '../../../../../interface';
import { useDropzone } from 'react-dropzone';
import { Pencil, PlusCircle, Trash } from '@phosphor-icons/react/dist/ssr';
import classNames from 'classnames';
const schema = zod.object({
    title: zod.string().min(1, { message: 'Title is required' }),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { title: '' } satisfies Values;

export interface ICollectionCreateItemProps {
    index: string;
    onSubmitData?: (data: ICollectionCreateItem) => void;
    onDeleteItem?: (key: string, data?: ICollectionCreateItem | null) => void;
    onAddItem?: (key: string) => void;
    options?: {
        disabledDelete?: boolean;
    };
}

export default function CollectionCreateItem({ index, options = { disabledDelete: false }, onSubmitData, onAddItem, onDeleteItem }: ICollectionCreateItemProps) {
    const [data, setData] = useState<ICollectionCreateItem | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [submited, setSubmited] = useState(false);

    const {
        control,
        handleSubmit,
        setError,
        setValue,
        formState: { errors },
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            if (!data || !data.file) {
                toast.warn('Ảnh chưa được chọn');
                return;
            }

            if (onSubmitData) {
                onSubmitData({ ...data, title: values.title, id: index });
            }

            setSubmited(true);
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data],
    );

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];

        if (!file.type.includes('image')) {
            toast.warn('Ảnh không hợp lệ');
            return;
        }

        if (file.size > 1024 * 1024 * 2) {
            toast.warn('Kích thước ảnh quá lớn. Chỉ chấp nhận ảnh dưới 2mb');
            return;
        }

        if (!data) {
            setData({
                id: index,
                file,
                title: '',
            });
        } else {
            setData({
                ...data,
                file,
            });
        }

        const url = URL.createObjectURL(file);

        setImagePreview(url);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const handleCloseImage = () => {
        if (!data) return;
        setData({
            ...data,
            file: null,
        });
        setImagePreview(null);
    };

    useEffect(() => {
        if (!imagePreview) return;

        return () => {
            URL.revokeObjectURL(imagePreview);
        };
    }, [imagePreview]);

    return (
        <div className="border border-gray-400 rounded-lg py-4 px-6 w-full flex items-center gap-4">
            <figure className="w-full max-w-[180px] border-2 hover:border-black aspect-square relative rounded-lg overflow-hidden transition-all ease-linear">
                {data?.file && imagePreview && <img className="w-full h-full object-cover" alt={imagePreview} src={imagePreview} />}

                {!submited && data?.file && imagePreview && (
                    <div className="w-full h-full absolute flex items-start justify-end z-10 top-0 font-bold hover:underline">
                        <span onClick={handleCloseImage} className="text-heart p-1 hover:bg-[rgba(255,255,255,.4)] cursor-pointer m-1 rounded-lg transition-all ease-linear">
                            <Trash />
                        </span>
                    </div>
                )}

                <div {...getRootProps({})} className="flex items-center justify-center bg-[rgba(255,255,255,.4)] w-full h-full text-2xl cursor-pointer">
                    <input
                        {...getInputProps({
                            accept: 'image/*',
                            multiple: false,
                        })}
                    />
                    <Pencil />
                </div>
            </figure>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-1 justify-center w-full h-full relative">
                <div className="p-1 cursor-pointer absolute  top-0 right-0 text-xl pr-0 select-none flex items-center gap-4">
                    <Trash
                        onClick={onDeleteItem && !options.disabledDelete ? () => onDeleteItem(index, data) : undefined}
                        className={classNames('', {
                            ['hover:text-heart']: !options.disabledDelete,
                            ['text-gray-400']: options.disabledDelete,
                        })}
                    />
                    <PlusCircle onClick={onAddItem ? () => onAddItem(index) : undefined} className="hover:text-blue-600" />
                </div>
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
                            <OutlinedInput disabled={submited} {...field} label="Username" type="text" />
                            {errors.title ? <FormHelperText>{errors.title.message}</FormHelperText> : null}
                        </FormControl>
                    )}
                />

                <div className="flex items-center justify-end w-full">
                    <Button disabled={submited} fullWidth type="submit" variant="contained">
                        OK
                    </Button>
                </div>
            </form>
        </div>
    );
}
