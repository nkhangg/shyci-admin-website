import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';
import { IPagination } from '../../interface';
import { paths } from '@/paths';

export interface IuseHandlePaginationProps {
    baseUrl?: string;
}

export default function useHandlePagination({ baseUrl = paths.home }: IuseHandlePaginationProps) {
    const searchParam = useSearchParams();

    const page = searchParam.get('page');

    const router = useRouter();

    const handleNext = (info: IPagination<any>['meta']) => {
        router.push(baseUrl + `?page=${info.currentPage + 1}`);
    };
    const handlePrev = (info: IPagination<any>['meta']) => {
        router.push(baseUrl + `?page=${info.currentPage - 1}`);
    };

    return {
        page: !page || Number.isNaN(page) ? 1 : Number(page),
        handleNext,
        handlePrev,
    };
}
