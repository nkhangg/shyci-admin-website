import axios from '../config';
import { IBaseApi, IChartSeri, IDProduct, IFilterProduct, IImageProduct, IPagination, ISize } from '../../../interface';
import { AxiosError } from 'axios';
import { removeFalsyValues } from '@/ultils/funtions';

export const createImagesProduct = async (images: IImageProduct[]) => {
    const formData = new FormData();

    images.forEach((image) => {
        if (image.file) {
            formData.append('images', image.file);
        }
    });

    const response = await axios({
        method: 'POST',
        url: 'products/create-images',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        data: formData,
    });

    if (!response) return null;

    return response.data as IBaseApi<string[]>;
};

export const createProduct = async ({
    values,
    images,
    curSizes,
}: {
    values: { name: string; showSize: boolean; description: string; categoriesID: number };
    images: IImageProduct[];
    curSizes: ISize[];
}) => {
    const sizes = curSizes.map((size) => ({ name: size.name, price: size.price, store: size.store, discount: size.discount }));
    try {
        const responseImages = await createImagesProduct(images);

        if (responseImages && responseImages?.status) {
            return null;
        }

        const response = await axios({
            method: 'POST',
            url: 'products',
            data: {
                name: values.name,
                description: values.description,
                showSize: values.showSize,
                categoriesID: values.categoriesID,
                sizes: sizes,
                images: responseImages?.data,
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IDProduct>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const getProduct = async (id?: string) => {
    try {
        if (!id) return null;

        const response = await axios({
            method: 'GET',
            url: 'products/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IDProduct>;
    } catch (error) {
        return null;
    }
};

export const updateInfoProduct = async (data: IDProduct) => {
    const newSize = data.sizes.map((item) => {
        if (typeof item.id === 'string') {
            return {
                createdAt: '',
                name: item.name,
                price: item.price,
                store: item.store,
                discount: item.discount,
            };
        }

        return {
            ...item,
        };
    });

    try {
        const response = await axios({
            method: 'PATCH',
            url: 'products/' + data.id,
            data: {
                name: data.name,
                description: data.description,
                showSize: data.showSize,
                categoriesID: Number(data.category.id),
                sizes: newSize,
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IDProduct>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const deleteSizeProduct = async (idProduct: string, id: number) => {
    try {
        if (!id) return null;

        const response = await axios({
            method: 'DELETE',
            url: 'products/sizes/' + `${idProduct}/${id}`,
        });

        if (!response) return null;

        return response.data as IBaseApi<ISize>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const pushImagesProduct = async (idProduct: string, data: IImageProduct[]) => {
    try {
        const formData = new FormData();

        data.forEach((image) => {
            if (image.file) {
                formData.append('images', image.file);
            }
        });

        const response = await axios({
            method: 'POST',
            url: 'products/create-images/' + idProduct,
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        });

        return response.data as IBaseApi<string[]>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const deleteImagesProduct = async (idProduct: string, ids: number[]) => {
    try {
        if (!ids.length || !idProduct) return null;

        const response = await axios({
            method: 'DELETE',
            url: 'products/images/' + `${idProduct}`,
            data: {
                ids,
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IImageProduct[]>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const getProducts = async (data: IFilterProduct) => {
    const newObj: Record<string, any> = removeFalsyValues(data);

    try {
        const response = await axios({
            method: 'GET',
            url: 'products',
            params: {
                limit: data.limit || 12,
                ...newObj,
            },
        });

        if (!response) return null;

        return response.data as IPagination<IDProduct>;
    } catch (error) {
        return null;
    }
};

export const getChartProduct = async (id: string) => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'products/chart/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IChartSeri[]>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const deleteProduct = async (id: string) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: 'products/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IDProduct>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const restoreProduct = async (id: string) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: 'products/restore/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IDProduct>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};
