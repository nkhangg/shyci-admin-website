import axios from '../config';
import { IAdmin, IBaseApi, IDropdownData, IFilter, IPagination, IRole } from '../../../interface';
import { removeFalsyValues } from '@/ultils/funtions';
import { AxiosError } from 'axios';

export const getAdmins = async (queries?: IFilter) => {
    const newObj = removeFalsyValues(queries || {});

    try {
        const response = await axios({
            method: 'GET',
            url: 'admins',
            params: newObj,
        });

        if (!response) return null;

        return response.data as IPagination<IAdmin>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IPagination<IAdmin>;
    }
};

export const getAdmin = async (id: string) => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'admins/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IAdmin>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<IAdmin>;
    }
};

export const deleteAdmin = async (id: string) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: 'admins/' + id,
        });

        if (!response) return null;

        return response.data as IBaseApi<IAdmin>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<IAdmin>;
    }
};

export const deleteRoleAdmin = async (id: string, idAuthor: number) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: 'admins/roles/' + `${id}/${idAuthor}`,
        });

        if (!response) return null;

        return response.data as IBaseApi<IAdmin>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<IAdmin>;
    }
};

export const getRoles = async () => {
    try {
        const response = await axios({
            method: 'GET',
            url: 'admins/roles',
        });

        if (!response) return null;

        return response.data as IBaseApi<IRole[]>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<IRole[]>;
    }
};

export const updateAdmin = async (id: string, data: { fullname: string; roles: IDropdownData[] }) => {
    try {
        const rolesIds: number[] = [];

        data.roles.forEach((item) => {
            rolesIds.push(+item.id);
        });

        const response = await axios({
            method: 'PUT',
            url: 'admins/' + id,
            data: {
                fullname: data.fullname,
                ...(rolesIds.length ? { roles: rolesIds } : {}),
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IAdmin>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<IAdmin>;
    }
};

export const changePasswordAdmin = async (id: string, data: { oldPassword: string; newPassword: string }) => {
    try {
        const response = await axios({
            method: 'PATCH',
            url: 'admins/' + id,
            data: {
                ...data,
            },
        });

        if (!response) return null;

        return response.data as IBaseApi<IAdmin>;
    } catch (error) {
        const erorrs = error as AxiosError;
        return erorrs.response?.data as unknown as IBaseApi<IAdmin>;
    }
};
