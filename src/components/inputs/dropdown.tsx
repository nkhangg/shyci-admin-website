'use client';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { FocusEventHandler, useId, useState } from 'react';
import { IDropdownData } from '../../../interface';

export interface IDropdownProps {
    title: string;
    data: IDropdownData[];
    value?: string;
    disabled?: boolean;
    name?: string;
    ref?: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined;
    onChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default function Dropdown({ title, data, ...props }: IDropdownProps) {
    const id = useId();

    return (
        <div className="flex flex-col justify-center gap-1 w-full ">
            <span className="text-md font-medium text-gray-400">{title}</span>
            <Select {...props} fullWidth size="small" labelId={id} id={id}>
                {data.map((item) => {
                    return (
                        <MenuItem key={item.id} value={item.id}>
                            {item.name}
                        </MenuItem>
                    );
                })}
            </Select>
        </div>
    );
}
