'use client';
import { getProducts, restoreProduct } from '@/apis/handlers/products';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
import Product from '@/components/dashboard/products/product';
import NotFound from '@/components/erorrs/not-found';
import Pagination from '@/components/tables/pagination';
import useHandlePagination from '@/hooks/use-handle-pagination';
import { paths } from '@/paths';
import { useQuery } from '@tanstack/react-query';
import { useConfirm } from 'material-ui-confirm';
import React, { useMemo } from 'react';
import { IDProduct } from '../../../../../interface';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

export interface ITrashProductPageProps {}

export default function TrashProductPage(props: ITrashProductPageProps) {
    const router = useRouter();

    const baseUrl = paths.dashboard.products;

    const { page, handleNext, handlePrev } = useHandlePagination({ baseUrl });
    const { data, isLoading } = useQuery({
        queryKey: ['get product', page],
        queryFn: () => getProducts({ deleted: true }),
    });

    const comfirm = useConfirm();

    const dataMemo = useMemo(() => {
        if (!data) return [];

        return data.items;
    }, [data]);

    const handleRestore = async (data: IDProduct) => {
        try {
            comfirm({ title: 'Bạn muốn khôi phục sản phẩm này ?', description: 'Sản phẩm sẽ được đưa lại vào hệ thống' }).then(async () => {
                const response = await restoreProduct(data.id);

                if (!response) {
                    toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
                    return;
                }

                if (response.status && response.code === 403) {
                    toast.error('Bạn không có quyền sử dụng chức năng này');
                    return;
                }

                if (response.status && response.code !== 200) {
                    toast.warn(response.message);
                    return;
                }

                if (response.status && response.code === 402) {
                    return;
                }

                router.push(paths.dashboard.products);
                toast.success('Khôi phục thành công');
            });
        } catch (error) {
            console.log(error);
            toast.warn('Có lỗi xảy ra trong quá trình xử lí. Vui lòng thử lại');
        }
    };
    return (
        <section>
            <div className="">
                <Pagination showDelete={false} data={data?.meta} onNext={handleNext} onPrev={handlePrev} />
            </div>

            {!isLoading && dataMemo.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
                    {dataMemo.map((item) => {
                        return <Product options={{ disableLink: true }} onClick={handleRestore} key={item.id} data={item} />;
                    })}
                </div>
            )}

            {!isLoading && dataMemo.length <= 0 && <NotFound />}

            {isLoading && <FullpageLoading />}
        </section>
    );
}
