import { useSearchParams } from 'next/navigation';
import * as React from 'react';

export default function useGetCurrentPage() {
    const searchParam = useSearchParams();

    const page = searchParam.get('page');

    const curPage = !page || Number.isNaN(page) ? 1 : Number(page);

    const countIndex = (index: number) => {
        const useIndex = index + 1;
        if (curPage <= 1) return useIndex;
        return useIndex + curPage * 10;
    };

    return { page: curPage, countIndex };
}
