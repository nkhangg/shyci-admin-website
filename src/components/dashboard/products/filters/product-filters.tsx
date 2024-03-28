'use client';
import React, { useMemo } from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import DropdownCateries from '@/components/inputs/colaps/dropdown-categories';
import MultipleSlideBar from '@/components/inputs/multiple-slider-bars/multiple-slide-bar';
import Dropdown from '@/components/inputs/dropdown';
import { constants } from '@/components/common/constants';
import Pagination, { IPaginationProps } from '@/components/tables/pagination';
import { getConfig } from '@/ultils/local-storege';

export interface IProductsFiltersProps {
    pagination: IPaginationProps;
    onSearch?: (value: string) => void;
    onSlider?: (data: { min: number; max: number }) => void;
    onSort?: (value: string) => void;
    onCategories?: (value: string) => void;
    onSize?: (value: string) => void;
}

export function ProductsFilters({ pagination, onSearch, onSlider, onSort, onCategories, onSize }: IProductsFiltersProps): React.JSX.Element {
    const maxValue = useMemo(() => {
        const resutl = getConfig('max-value-filter');

        if (resutl) {
            if (!Number.isNaN(resutl)) return Number(resutl);
        }

        return 1000000;
    }, []);

    return (
        <div className="flex flex-col gap-4 border rounded-lg p-4">
            <div className="flex items-center gap-4">
                <OutlinedInput
                    fullWidth
                    size="small"
                    placeholder="Search"
                    startAdornment={
                        <InputAdornment position="start">
                            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                        </InputAdornment>
                    }
                    sx={{ maxWidth: '500px' }}
                    onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
                />

                <DropdownCateries onChange={onCategories ? (e) => onCategories(e.target.value) : undefined} lable="Danh mục" />
                <Dropdown onChange={onSize ? (e) => onSize(e.target.value) : undefined} lable="Kích thước" data={constants.sizes} />
            </div>

            <div className="flex gap-8 pl-2">
                <div className="flex-1">
                    <MultipleSlideBar min={0} max={maxValue} onChange={onSlider} />
                </div>
                <div className="w-1/4">
                    <Dropdown
                        lable="Sấp xếp"
                        data={[
                            {
                                id: 'latest',
                                name: 'Mới nhất',
                            },
                            {
                                id: 'oldnest',
                                name: 'Cũ nhất',
                            },
                        ]}
                        onChange={
                            onSort
                                ? (e) => {
                                      onSort(e.target.value);
                                  }
                                : undefined
                        }
                    />
                </div>
            </div>
            <Pagination showDelete={false} {...pagination} />
        </div>
    );
}
