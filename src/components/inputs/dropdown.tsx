'use client';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React, { FocusEventHandler, useId, useMemo, useRef, useState } from 'react';
import { IDropdownData } from '../../../interface';

export interface IDropdownProps {
    title?: string;
    lable?: string;
    data: IDropdownData[];
    value?: string;
    disabled?: boolean;
    name?: string;
    ref?: ((instance: unknown) => void) | React.RefObject<unknown> | null | undefined;
    showAllItem?: boolean;
    nameDefault?: string;
    onChange?: (event: SelectChangeEvent<string>, child: React.ReactNode) => void;
    onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

export default function Dropdown({ title, data, lable, showAllItem = true, nameDefault = 'Tất cả', ...props }: IDropdownProps) {
    const id = useId();

    const dataMemo = useMemo(() => {
        if (showAllItem) {
            return [{ id: 0, name: nameDefault }, ...data];
        }

        return data;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, showAllItem]);

    return (
        <>
            {title && (
                <div className="flex flex-col justify-center gap-1 w-full ">
                    <span className="text-md font-medium text-gray-400">{title}</span>
                    <Select {...props} fullWidth size="small" labelId={id} id={id}>
                        {dataMemo.map((item) => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </div>
            )}

            {lable && (
                <FormControl size="small" fullWidth>
                    <InputLabel id={id}>{lable}</InputLabel>
                    <Select labelId={id} id={id + 'select'} {...props} label={lable}>
                        {dataMemo.map((item) => {
                            return (
                                <MenuItem key={item.id} value={item.id}>
                                    {item.name}
                                </MenuItem>
                            );
                        })}
                    </Select>
                </FormControl>
            )}
        </>
    );
}
