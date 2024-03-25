import { AxiosError } from 'axios';
import { IBaseApi, IDropdownData } from '../../../interface';
import axios from '../config';

export const getCategories = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'categories',
        });

        if (!response) return null;

        return response.data as IBaseApi<IDropdownData[]>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<any>;
    }
};
