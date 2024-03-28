'use client';
import CustomBox from '@/components/common/boxs/custom-box';
import Input from '@/components/inputs/input';
import { Button, Checkbox, CircularProgress, FormControl, FormControlLabel, FormHelperText, InputLabel, OutlinedInput } from '@mui/material';
import { z as zod } from 'zod';
import React, { MutableRefObject, useCallback, useEffect, useImperativeHandle, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Editor from '@/components/inputs/edittor';
import Inventories from '@/components/dashboard/products/inventories';
import ImagesProduct from '@/components/dashboard/products/images-product/images';
import SizeItem from '@/components/dashboard/products/size-item';
import { IDProduct, IImageProduct, IRefChildImages, ISize } from '../../../../interface';
import { useConfirm } from 'material-ui-confirm';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
import { toast } from 'react-toastify';
import DropdownCateries from '@/components/inputs/colaps/dropdown-categories';
import { createProduct, deleteProduct, deleteSizeProduct, getProduct, updateInfoProduct } from '@/apis/handlers/products';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { paths } from '@/paths';
import { ProductService } from '@/ultils/services/products.service';

const schema = zod.object({
    name: zod.string().min(1, { message: 'Tên sản phẩm bắt buộc' }),
    description: zod.string().min(1, { message: 'Mô tả sản phẩm bắt buộc' }),
    categoriesID: zod.number(),
    showSize: zod.boolean(),
});

type Values = zod.infer<typeof schema>;

const defaultValues = { name: '', description: '', showSize: true, categoriesID: 1 } satisfies Values;
export interface IProductPageProps {
    refChild?: MutableRefObject<{ setLoading: (val: boolean) => void }>;
    id?: string;
    mode?: 'create' | 'update';
}

export default function ActionProduct({ mode = 'create', id, refChild }: IProductPageProps) {
    const router = useRouter();

    const refInventories = useRef<any>();
    const refImages = useRef<IRefChildImages>({});

    const [loading, setLoading] = useState(!!id || false);

    const [curSizes, setCurSizes] = useState<ISize[]>([]);
    const [images, setImages] = useState<IImageProduct[]>([]);

    const [displaySize, setDisplaySize] = useState<ISize | undefined>(undefined);

    const { data, isFetching, refetch } = useQuery({
        queryKey: ['get-product', id],
        queryFn: () => getProduct(id),
    });

    useImperativeHandle(refChild, () => {
        return {
            setLoading,
        };
    });

    const comfirm = useConfirm();
    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
        reset,
        setValue,
    } = useForm<Values>({ defaultValues, resolver: zodResolver(schema) });

    const validator = useCallback(() => {
        const message: string[] = [];

        if (!images.length) {
            message.push('Bạn chưa thêm ảnh cho sản phẩm này');
        }

        if (!curSizes.length) {
            message.push('Bạn chưa thêm kho cho sản phẩm này');
        }

        if (message.length) {
            toast.warn(
                <div className="flex flex-col gap-2">
                    {message.map((item) => {
                        return <span key={item}>{item}</span>;
                    })}
                </div>,
            );

            return true;
        }

        return false;
    }, [curSizes.length, images.length]);

    const handleWhenSuccess = () => {
        toast.success('Tạo thành công');

        setCurSizes([]);
        reset();
        refInventories.current.reset();

        if (refImages?.current && refImages?.current.reset) {
            refImages.current.reset();
        }
    };

    const onSubmit = useCallback(
        async (values: Values): Promise<void> => {
            if (validator()) return;

            if (mode === 'create') {
                try {
                    setLoading(true);
                    const response = await createProduct({ values, images, curSizes });

                    if (!response) {
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                        return;
                    }

                    if (response.status && response.code === 403) {
                        toast.error('Bạn không có quyền sử dụng chức năng này');
                        return;
                    }

                    if (response.status && response.code === 400) {
                        toast.warn(response.message);
                        return;
                    }

                    if (response.status && response.code === 402) {
                        return;
                    }

                    handleWhenSuccess();
                } catch (error) {
                    console.log(error);
                    toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                } finally {
                    setLoading(false);
                }
            } else {
                if (!data) {
                    toast.warn('Có lỗi trong quá trình xử lí');
                    return;
                }

                comfirm({ title: 'Bạn muốn cập nhật sản phẩm này ?' }).then(async () => {
                    try {
                        setLoading(true);

                        const resultInfo = await ProductService.updateInfoProduct(data.data, values, curSizes, images);

                        if (resultInfo) {
                            refetch();
                        }
                    } catch (error) {
                        console.log(error);
                        toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                    } finally {
                        setLoading(false);
                    }
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [curSizes, data, images, mode, validator],
    );

    const handleAddSize = async (size: ISize) => {
        if (displaySize) {
            await comfirm({ title: 'Bạn muốn cập nhật kho này ?' }).then(() => {
                const findData = curSizes.find((item) => item.id === displaySize.id);

                if (findData) {
                    findData.name = size.name;
                    findData.discount = size.discount;
                    findData.price = size.price;
                    findData.store = size.store;
                }

                setCurSizes([...curSizes]);
                setDisplaySize(undefined);
                return;
            });

            return;
        }

        setCurSizes([...curSizes, size]);
    };

    const handleCancelUpdateInventories = () => {
        refInventories.current.reset();
        setDisplaySize(undefined);
    };

    const handleDeleteSizeItem = useCallback(
        (size: ISize) => {
            comfirm({ title: 'Bạn muốn xóa kho này ?' }).then(async () => {
                try {
                    if (typeof size.id === 'string') {
                        const newCurrentSize = curSizes.filter((item) => item.id !== size.id);

                        setCurSizes([...newCurrentSize]);
                    }

                    if (typeof size.id === 'number') {
                        // handle api to delete on server here
                        if (mode !== 'update' || !data?.data) return;

                        const response = await deleteSizeProduct(data.data.id, size.id);

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

                        refetch();
                        toast.success('Xóa thành công');
                    }
                } catch (error) {
                    console.log(error);
                    toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                }
            });
        },
        [comfirm, curSizes, data?.data, mode, refetch],
    );

    useEffect(() => {
        if (mode !== 'update' || !id) return;

        if ((!data && !isFetching) || (data && data.code !== 200)) {
            toast.warn(data?.message || 'Có lỗi trong quá trình xử lí');
            router.push(paths.dashboard.products);
            return;
        }
        setLoading(false);

        requestIdleCallback(() => {
            const prodcut = data?.data;

            if (!prodcut) return;

            // values
            setValue('categoriesID', Number(prodcut.category.id));
            setValue('description', prodcut.description);
            setValue('name', prodcut.name);
            setValue('showSize', prodcut.showSize);

            // sizes
            setCurSizes([...prodcut.sizes]);

            // images

            if (!refImages.current || !refImages.current.init) return;

            refImages.current.init(prodcut.images);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, id, data, isFetching]);

    const handleDeleteProduct = async () => {
        comfirm({ title: 'Bạn muốn sản phẩm này ?' }).then(async () => {
            try {
                if (!id) return;

                setLoading(true);
                const response = await deleteProduct(id);

                if (!response) {
                    toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                    return;
                }

                if (response.status && response.code === 403) {
                    toast.error('Bạn không có quyền sử dụng chức năng này');
                    return;
                }

                if (response.status && response.code !== 200) {
                    toast.warn(response.message);
                    return;
                }

                if (response.status && response.code === 402) {
                    return;
                }

                router.push(paths.dashboard.products);
            } catch (error) {
                console.log(error);
                toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
            } finally {
                setLoading(false);
            }
        });
    };

    return (
        <section>
            <div className="grid lg:grid-cols-[minmax(900px,_3fr)_2fr] gap-6">
                <div className="w-full flex flex-col gap-8">
                    {/* Thông tin cơ bản */}
                    <CustomBox
                        title={'Thông tin cơ bản'}
                        classnames={{
                            body: 'flex flex-col gap-4',
                        }}
                    >
                        <Controller
                            control={control}
                            name="showSize"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.showSize)} sx={{ width: '100%' }}>
                                    <FormControlLabel
                                        {...field}
                                        sx={{
                                            '& .MuiTypography-root': {
                                                fontSize: '14px',
                                                fontStyle: 'italic',
                                                userSelect: 'none',
                                            },
                                        }}
                                        control={<Checkbox size="small" defaultChecked />}
                                        label="Hiển thị size"
                                    />
                                    {errors.showSize ? <FormHelperText>{errors.showSize.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                        {mode === 'update' && data && <Input title="Mã sản phẩm" disabled={true} value={data.data?.id} />}
                        <Controller
                            control={control}
                            name="name"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.name)} sx={{ width: '100%' }}>
                                    <Input {...field} title="Tên sản phẩm" />
                                    {errors.name ? <FormHelperText>{errors.name.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                        <Controller
                            control={control}
                            name="description"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.description)} sx={{ width: '100%' }}>
                                    <Editor ref={field.ref} title="Mô tả sản phẩm" onBlur={field.onBlur} value={field.value} setValue={field.onChange} />

                                    {errors.description ? <FormHelperText>{errors.description.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                    </CustomBox>

                    {/* Kho and sizes */}
                    <CustomBox
                        title={'Kho'}
                        classnames={{
                            body: 'flex flex-col gap-4',
                        }}
                    >
                        <Inventories
                            displayData={displaySize}
                            onAddSize={handleAddSize}
                            onCancel={handleCancelUpdateInventories}
                            currentInventories={curSizes}
                            refChild={refInventories}
                        />
                    </CustomBox>
                </div>
                <div className="w-full flex flex-col gap-8">
                    <ImagesProduct onDeleteSucess={refetch} options={{ id, mode }} refChild={refImages} onImages={(data) => setImages(data)} />

                    <CustomBox title="Danh mục của sản phẩm">
                        <Controller
                            control={control}
                            name="categoriesID"
                            render={({ field }) => (
                                <FormControl error={Boolean(errors.categoriesID)} sx={{ width: '100%' }}>
                                    <DropdownCateries showAllItem={false} {...field} value={field.value + ''} title="Danh mục" />
                                    {errors.categoriesID ? <FormHelperText>{errors.categoriesID.message}</FormHelperText> : null}
                                </FormControl>
                            )}
                        />
                    </CustomBox>

                    {curSizes.length > 0 && (
                        <CustomBox title="Kho đã thêm">
                            <div className="grid grid-cols-2 gap-4">
                                {curSizes.map((item) => {
                                    return <SizeItem onClick={setDisplaySize} onDelete={handleDeleteSizeItem} key={item.id} data={item} />;
                                })}
                            </div>
                        </CustomBox>
                    )}

                    <div className="w-full flex items-center justify-center gap-4">
                        {mode === 'update' && id && (
                            <Button onClick={handleDeleteProduct} variant="contained" color="error">
                                Xóa sản phẩm
                            </Button>
                        )}

                        <Button onClick={handleSubmit(onSubmit)} variant="contained">
                            {mode === 'create' ? 'Tạo sản phẩm' : 'Cập nhật sản phẩm'}
                        </Button>
                    </div>
                </div>
            </div>

            {loading && <FullpageLoading />}
        </section>
    );
}
