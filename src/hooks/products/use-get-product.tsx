import { getProduct } from '@/apis/handlers/products';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'react-toastify';

export interface IuseGetProductProps {}

export default function useGetProduct(id?: string, loadingFn?: (val: boolean) => void) {
    const { data, isError, isFetching } = useQuery({
        queryKey: ['get-product', id],
        queryFn: () => getProduct(id),
    });

    return useMemo(() => {
        if (!data && isError) {
            toast.warn('Có lỗi trong quá trình xử lí');
            return;
        }

        if (!isFetching) {
            if (loadingFn) {
                loadingFn(true);
            }
            return data?.data;
        }
    }, [data, isError, isFetching, loadingFn]);
}
