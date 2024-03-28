'use client';
import { getProducts } from '@/apis/handlers/products';
import FullpageLoading from '@/components/common/loadings/fullpage-loading';
/* eslint-disable @next/next/no-img-element */
import { ProductsFilters } from '@/components/dashboard/products/filters/product-filters';
import Product from '@/components/dashboard/products/product';
import useHandlePagination from '@/hooks/use-handle-pagination';
import { paths } from '@/paths';
import { formatNumber, toCurrency } from '@/ultils/funtions';
import { Button, IconButton, Tooltip } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import RouterLink from 'next/link';
import { useRouter } from 'next/navigation';

import React, { useMemo, useState } from 'react';
import { IFilterProduct } from '../../../../interface';
import useDebounce from '@/hooks/useDebounce';
import NotFound from '@/components/erorrs/not-found';
import { Trash } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';

export interface ICreateProductPageProps {}

export default function CreateProductPage(props: ICreateProductPageProps) {
    const router = useRouter();

    const [filters, setFilters] = useState<IFilterProduct>({});

    const baseUrl = paths.dashboard.products;

    const { page, handleNext, handlePrev } = useHandlePagination({ baseUrl });

    const minD = useDebounce(filters.min || 0, 800);
    const maxD = useDebounce(filters.max || 0, 800);
    const searchD = useDebounce(filters.search || '', 800);

    const { data, isLoading } = useQuery({
        queryKey: ['get product', page, { ...filters, min: minD, max: maxD, search: searchD }],
        queryFn: () => getProducts({ ...filters, page, min: minD as number, max: maxD as number, search: searchD as string }),
    });

    const dataMemo = useMemo(() => {
        if (!data) return [];

        return data.items;
    }, [data]);

    return (
        <section className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-medium">Danh sách sản phẩm</h1>
                <div className="flex items-center gap-8">
                    {/* component={RouterLink} href={paths.dashboard.products + '/trash'} */}
                    <IconButton>
                        <Tooltip title="Xem danh sách sản phẩm đã xóa" placement="top">
                            <Link className="hover:text-heart" href={paths.dashboard.products + '/trash'}>
                                <Trash />
                            </Link>
                        </Tooltip>
                    </IconButton>
                    <Button component={RouterLink} href={paths.dashboard.products + '/create'} variant="contained">
                        Tạo mới
                    </Button>
                </div>
            </div>

            <ProductsFilters
                pagination={{
                    data: data?.meta || undefined,
                    onNext: handleNext,
                    onPrev: handlePrev,
                }}
                onSearch={(e) => setFilters({ ...filters, search: e })}
                onSize={(e) => setFilters({ ...filters, size: e })}
                onCategories={(e) => setFilters({ ...filters, categories: Number(e) })}
                onSlider={({ min, max }) => setFilters({ ...filters, min, max })}
                onSort={(e) => setFilters({ ...filters, sort: e })}
            />

            {!isLoading && dataMemo.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4 gap-4">
                    {dataMemo.map((item) => {
                        return <Product key={item.id} data={item} />;
                    })}
                </div>
            )}

            {!isLoading && dataMemo.length <= 0 && <NotFound />}

            {isLoading && <FullpageLoading />}
        </section>
    );
}
