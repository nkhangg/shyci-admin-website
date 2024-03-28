import { AxiosError } from 'axios';
import { IBaseApi, IDropdownData, IFilter } from '../../../interface';
import axios from '../config';
import { removeFalsyValues } from '@/ultils/funtions';

export const getCategories = async (filters?: IFilter) => {
    const newObj: Record<string, any> = removeFalsyValues(filters || {});

    try {
        const response = await axios({
            method: 'GET',
            url: 'categories',
            params: { ...newObj },
        });

        if (!response) return null;

        return response.data as IBaseApi<IDropdownData[]>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const updateCategories = async (id: number, data: string) => {
    try {
        const response = await axios({
            method: 'PATCH',
            url: 'categories/' + id,
            data: { name: data },
        });

        if (!response) return null;

        return response.data as IBaseApi<IDropdownData>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const createCategories = async (data: string) => {
    try {
        const response = await axios({
            method: 'POST',
            url: 'categories',
            data: { name: data },
        });

        if (!response) return null;

        return response.data as IBaseApi<IDropdownData>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const deleteCategories = async (id: number) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: 'categories/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IDropdownData>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const restoreCategories = async (id: number) => {
    try {
        const response = await axios({
            method: 'PUT',
            url: 'categories/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IDropdownData>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};
