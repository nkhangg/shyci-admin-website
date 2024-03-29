import axios from '../config';
import { IBaseApi, IDCustomer, IDOrder, IFilter, IFilterOrder, IImageProduct, IOrder, IPagination } from '../../../interface';
import { removeFalsyValues } from '@/ultils/funtions';
import { AxiosError } from 'axios';

export const getCustomer = async (queries?: IFilter) => {
    const newObj = removeFalsyValues(queries || {});

    try {
        const response = await axios({
            method: 'GET',
            url: 'customers',
            params: newObj,
        });

        if (!response) return null;

        return response.data as IPagination<IDCustomer>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IPagination<IDCustomer>;
    }
};
