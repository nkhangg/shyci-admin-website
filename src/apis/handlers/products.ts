import axios from '../config';
import { IBaseApi, IDProduct, IImageProduct, ISize } from '../../../interface';
import { AxiosError } from 'axios';

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
        return null;
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
