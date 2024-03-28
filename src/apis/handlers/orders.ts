import axios from '../config';
import { IBaseApi, IDOrder, IFilterOrder, IImageProduct, IOrder, IPagination } from '../../../interface';
import { removeFalsyValues } from '@/ultils/funtions';
import { AxiosError } from 'axios';

export const getOrders = async (data: IFilterOrder) => {
    const newObj: Record<string, any> = removeFalsyValues(data);

    try {
        const response = await axios({
            method: 'GET',
            url: 'orders',
            params: {
                limit: data.limit || 12,
                ...newObj,
            },
        });

        if (!response) return null;

        return response.data as IPagination<IOrder>;
    } catch (error) {
        return null;
    }
};

export const getOrder = async (id: number) => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'orders' + `/${id}`,
        });

        if (!response) return null;

        return response.data as IBaseApi<IDOrder>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const acceptOrderDeleteOrder = async (id: number, reason?: string) => {
    try {
        const response = await axios({
            method: 'PATCH',
            url: 'orders' + `/${id}`,
            data: { reason },
        });

        if (!response) return null;

        return response.data as IBaseApi<IDOrder>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};

export const comfirmOrder = async (id: number) => {
    try {
        const response = await axios({
            method: 'PATCH',
            url: 'orders/comfirm' + `/${id}`,
        });

        if (!response) return null;

        return response.data as IBaseApi<IDOrder>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};
