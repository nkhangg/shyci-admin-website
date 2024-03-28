'use client';
import React, { MutableRefObject, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react';
import TitleBox from '@/components/common/boxs/title-box';
import { Button } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import { filesValidator, max_files } from '@/ultils/funtions';
import ImageProductItem from './image';
import { IImageProduct, IRefChildImages } from '../../../../../interface';
import { v4 as uuidv4 } from 'uuid';
import CustomBox from '@/components/common/boxs/custom-box';
import { useConfirm } from 'material-ui-confirm';
import { deleteImagesProduct } from '@/apis/handlers/products';

export interface IImagesProductProps {
    onFiles?: (files: File[]) => void;
    onImages?: (images: IImageProduct[]) => void;
    refChild?: MutableRefObject<IRefChildImages>;
    onDeleteSucess?: () => void;
    options?: {
        mode?: 'create' | 'update';
        id?: string;
    };
}

export default function ImagesProduct({ onFiles, onImages, onDeleteSucess, refChild, options = { mode: 'create' } }: IImagesProductProps) {
    const [imagePreview, setImagePreview] = useState<IImageProduct[]>([]);

    const [deleteItems, setDeleteItems] = useState<IImageProduct[]>([]);

    const comfirm = useConfirm();

    useImperativeHandle(refChild, () => {
        return {
            reset: () => {
                clearMemory(imagePreview);
                setImagePreview([]);
                setDeleteItems([]);
            },
            init: (data) => {
                setImagePreview(data);
            },
        };
    });

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (filesValidator(acceptedFiles, imagePreview)) return;

            const imagesPrev = acceptedFiles.map((item) => ({ id: uuidv4(), name: URL.createObjectURL(item), createAt: '', file: item }) as IImageProduct);

            const newImagePrev = imagePreview.concat(imagesPrev);

            if (newImagePrev.length > max_files) {
                toast.warn(`Sản phẩm phải có tối đa ${max_files} ảnh`);
                return;
            }

            setImagePreview(newImagePrev);

            if (onFiles) {
                onFiles(acceptedFiles);
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [imagePreview],
    );

    const handleAddDelete = useCallback(
        (item: IImageProduct) => {
            // if update mode
            // if(deleteItems.length >= imagePreview.length) return;

            setDeleteItems([...deleteItems, item]);
        },
        [deleteItems],
    );

    const handleRestoreImage = useCallback(
        (item: IImageProduct) => {
            const newDeleteItems = deleteItems.filter((i) => i.id !== item.id);

            setDeleteItems([...newDeleteItems]);
        },
        [deleteItems],
    );

    const handleClear = () => {
        setDeleteItems([]);
    };

    const clearMemory = (data: IImageProduct[]) => {
        data.forEach((item) => {
            if (typeof item.id === 'string') {
                URL.revokeObjectURL(item.id);
            }
        });
    };

    const handleDeleteImages = () => {
        try {
            const localsImages = deleteItems.filter((local) => typeof local.id === 'string');
            const serverImages = deleteItems.filter((server) => typeof server.id === 'number');

            if (serverImages.length > 0 && serverImages.length >= imagePreview.length) {
                toast.warn('Không thể xóa hết ảnh của một sản phẩm');
                return;
            }

            if (localsImages.length) {
                const newImagePrev = imagePreview.filter((item) => !localsImages.includes(item));

                clearMemory(newImagePrev);

                setImagePreview(newImagePrev);
            }

            if (serverImages.length && serverImages.length < imagePreview.length) {
                // call api to delete image
                if (options.mode === 'create' || !options.id) return;

                comfirm({ title: `Bạn muốn xóa ${deleteItems.length} ảnh của sản phẩm này ?`, description: 'Ảnh bị xóa sẽ không thể khôi phục' }).then(async () => {
                    const response = await deleteImagesProduct(options.id as string, serverImages.map((item) => item.id) as number[]);

                    if (!response) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                        return false;
                    }

                    if (response.status && response.code === 403) {
                        toast.error('Bạn không có quyền sử dụng chức năng này');
                        return false;
                    }
                    if (response.status && response.code === 402) {
                        return false;
                    }

                    if (onDeleteSucess) {
                        onDeleteSucess();
                    }
                    toast.success('Xóa thành công');
                });
            }
        } catch (error) {
            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
        } finally {
            setDeleteItems([]);
        }
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.png', '.jpg'],
        },
    });

    const renderImages = useMemo(() => {
        return imagePreview.map((image, index) => {
            return <ImageProductItem onDelete={handleAddDelete} onRestore={handleRestoreImage} key={index} checked={deleteItems.includes(image)} data={image} />;
        });
    }, [imagePreview, handleAddDelete, handleRestoreImage, deleteItems]);

    useEffect(() => {
        return () => {
            if (imagePreview && imagePreview.length) {
                imagePreview.forEach((image) => {
                    if (Number.isNaN(image.id)) {
                        URL.revokeObjectURL(image.name);
                    }
                });
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!onImages) return;

        onImages(imagePreview);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [imagePreview]);

    return (
        <CustomBox title={'Thông tin khác'}>
            <TitleBox
                title="Ảnh sản phẩm"
                className="border-2 border-dashed rounded-lg p-5 bg-[#f9f9f9]"
                action={
                    deleteItems.length > 0 ? (
                        <>
                            <div className="flex items-center gap-4 select-none">
                                <span onClick={handleClear} className="text-violet-500 hover:underline text-sm cursor-pointer">
                                    Clear
                                </span>
                                <span onClick={handleDeleteImages} className="text-heart hover:underline text-sm cursor-pointer">
                                    Delete
                                </span>
                            </div>
                        </>
                    ) : undefined
                }
            >
                <div {...getRootProps()} className="flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4">{renderImages}</div>

                    <input {...getInputProps()} />
                    {imagePreview.length < max_files && (
                        <div className="w-full flex justify-center items-center">
                            <Button size="small" variant="contained">
                                Thêm ảnh
                            </Button>
                        </div>
                    )}
                </div>
            </TitleBox>
        </CustomBox>
    );
}
