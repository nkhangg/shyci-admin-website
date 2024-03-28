'use client';
import React, { useEffect, useMemo } from 'react';
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
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { ArrowULeftDown } from '@phosphor-icons/react/dist/ssr';
import { IconButton } from '@mui/material';
import { IFilterOrder } from '../../../../../interface';
export interface IOrdersFiltersProps {
    pagination: IPaginationProps;
    filters?: IFilterOrder;
    onSearch?: (value: string) => void;
    onDate?: (data: { min: string; max: string }) => void;
    onSort?: (value: string) => void;
    onState?: (value: string) => void;
    onClear?: () => void;
}

export default function OrdersFilters({ pagination, filters, onSearch, onDate, onSort, onClear, onState }: IOrdersFiltersProps) {
    const [min, setMin] = React.useState<Dayjs | null>(null);
    const [max, setMax] = React.useState<Dayjs | null>(null);

    useEffect(() => {
        if (!min || !max || !onDate) return;

        onDate({ min: min.format('YYYY-MM-DD'), max: max.format('YYYY-MM-DD') });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [min, max]);

    const handleClear = () => {
        setMin(null);
        setMax(null);

        if (onClear) {
            onClear();
        }
    };

    return (
        <div className="flex flex-col gap-4 border rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4">
                <OutlinedInput
                    fullWidth
                    size="small"
                    placeholder="Search"
                    value={filters?.search}
                    startAdornment={
                        <InputAdornment position="start">
                            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                        </InputAdornment>
                    }
                    sx={{ maxWidth: '500px' }}
                    onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
                />

                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={min} onChange={(newValue) => setMin(newValue as Dayjs)} label={'Ngày bắt đầu'} slotProps={{ textField: { size: 'small' } }} />
                </LocalizationProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker value={max} onChange={(newValue) => setMax(newValue as Dayjs)} label={'Ngày kết thúc'} slotProps={{ textField: { size: 'small' } }} />
                </LocalizationProvider>
                <div className="grid grid-cols-2 gap-4">
                    <Dropdown
                        lable="Trạng thái"
                        data={[
                            { id: 'pending', name: 'Pending' },
                            { id: 'delivered', name: 'Delivered' },
                            { id: 'refunded', name: 'Refunded' },
                        ]}
                        onChange={
                            onState
                                ? (e) => {
                                      onState(e.target.value);
                                  }
                                : () => {}
                        }
                    />
                    <Dropdown
                        lable="Sấp xếp"
                        data={constants.sorts}
                        onChange={
                            onSort
                                ? (e) => {
                                      onSort(e.target.value);
                                  }
                                : () => {}
                        }
                    />
                </div>
            </div>

            <div className="flex items-center justify-between">
                <Pagination showDelete={false} {...pagination} />
                <div className="">
                    <IconButton onClick={handleClear}>
                        <ArrowULeftDown />
                    </IconButton>
                </div>
            </div>
        </div>
    );
}
