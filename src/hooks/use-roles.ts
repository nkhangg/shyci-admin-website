import { getRoles } from '@/apis/handlers/admins';
import { useQuery } from '@tanstack/react-query';
import React, { useMemo } from 'react';
import { IDropdownData, IRole } from '../../interface';
import { capitalize } from '@mui/material';

export default function useRoles() {
    const { data, ...props } = useQuery({
        queryKey: ['get-admins-roles'],
        queryFn: getRoles,
    });

    const dataMemo = useMemo(() => {
        if (!data?.data) return [] as IDropdownData[];

        const newData = data.data.map((item) => ({ id: item.id, name: capitalize(item.name) }) as IDropdownData);

        return newData;
    }, [data]);

    return {
        data: dataMemo,
        ...props,
    };
}
