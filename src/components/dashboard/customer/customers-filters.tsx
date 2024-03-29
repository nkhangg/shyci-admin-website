import * as React from 'react';
import Card from '@mui/material/Card';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { MagnifyingGlass as MagnifyingGlassIcon } from '@phosphor-icons/react/dist/ssr/MagnifyingGlass';
import Dropdown from '@/components/inputs/dropdown';
import { constants } from '@/components/common/constants';
import Pagination, { IPaginationProps } from '@/components/tables/pagination';
import { IFilter } from '../../../../interface';
import { IconButton } from '@mui/material';
import { ArrowULeftDown } from '@phosphor-icons/react/dist/ssr';

export interface CustomersFiltersProps {
    filters?: IFilter;
    pagination: IPaginationProps;
    onSort?: (e: string) => void;
    onSearch?: (value: string) => void;
}

export function CustomersFilters({ pagination, filters, onSearch, onSort }: CustomersFiltersProps): React.JSX.Element {
    return (
        <Card sx={{ p: 2 }}>
            <div className="flex items-center justify-between">
                <OutlinedInput
                    defaultValue=""
                    fullWidth
                    value={filters?.search}
                    size="small"
                    onChange={onSearch ? (e) => onSearch(e.target.value) : undefined}
                    placeholder="Tìm kiếm"
                    startAdornment={
                        <InputAdornment position="start">
                            <MagnifyingGlassIcon fontSize="var(--icon-fontSize-md)" />
                        </InputAdornment>
                    }
                    sx={{ maxWidth: '500px' }}
                />
                <div className="max-w-52 w-full">
                    <Dropdown
                        value={filters?.sort}
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
            </div>
        </Card>
    );
}
