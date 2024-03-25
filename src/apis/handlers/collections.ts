import { AxiosError } from 'axios';
import axios from '../config';
import { IBaseApi, ICollectionCreateItem, IPagination, IRowCollection } from '../../../interface';

export const collections = async (page?: number) => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'conllections-home',
            params: {
                page,
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IPagination<IRowCollection>>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const pustCollections = async (data: ICollectionCreateItem[]) => {
    const formData = new FormData();

    const files: File[] = [];

    data.forEach((item) => {
        if (item.file) {
            files.push(item.file);
        }
    });

    formData.append('data', JSON.stringify(data));

    files.forEach((item) => {
        formData.append('images', item);
    });

    try {
        const response = await axios({
            method: 'POST',
            url: 'conllections-home/multiple',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            data: formData,
        });

        if (!response) return null;

        return response.data as IBaseApi<IPagination<IRowCollection>>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const collection = async (id: string) => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'conllections-home' + `/${id}`,
        });

        if (!response) return null;

        return response.data as IBaseApi<IRowCollection>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const updateCollections = async (data: { id: string; title: string }) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: 'conllections-home' + `/${data.id}`,
            data: {
                title: data.title,
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IPagination<IRowCollection[]>>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const deleteCollections = async (ids: string[]) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: 'conllections-home',
            data: {
                ids,
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IPagination<IRowCollection[]>>;
    } catch (error) {
        const erorrs = error as AxiosError;
        console.log('error collection', erorrs);
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};
