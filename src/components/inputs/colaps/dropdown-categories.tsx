'use client';
import React, { useMemo } from 'react';
import Dropdown, { IDropdownProps } from '../dropdown';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/apis/handlers/categories';
import { toast } from 'react-toastify';
import { IDropdownData } from '../../../../interface';

export interface IDropdownCateriesProps {}

export default function DropdownCateries(props: Omit<IDropdownProps, 'data'>) {
    const { data, isError } = useQuery({
        queryKey: ['get-categories'],
        queryFn: () => getCategories(),
    });

    if (isError && data?.code !== 200) {
        toast.warn('Có lỗi trong quá trình lấy dữ liệu');
    }

    const dataMemo = useMemo(() => {
        if (!data) return [];

        return data.data as IDropdownData[];
    }, [data]);

    return <Dropdown {...props} data={dataMemo} />;
}
