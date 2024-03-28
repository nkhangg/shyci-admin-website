import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Box } from '@mui/system';
import { Slider } from '@mui/material';
import { toCurrency } from '@/ultils/funtions';
export interface IMultipleSlideBarProps {
    min: number;
    max: number;
    onChange?: (data: { min: number; max: number }) => void;
}

export default function MultipleSlideBar({ min, max, onChange }: IMultipleSlideBarProps) {
    const [value, setValue] = React.useState<number[]>([min, max]);

    const handleChange = (event: Event, newValue: number | number[]) => {
        setValue(newValue as number[]);

        if (onChange) {
            onChange({ min: value[0], max: value[1] });
        }
    };

    return (
        <div className="w-full">
            <Slider value={value} max={max} onChange={handleChange} valueLabelDisplay="off" />
            <div className="w-full flex items-center justify-between">
                <span>{toCurrency(value[0])}</span>
                <span>{toCurrency(value[1])}</span>
            </div>
        </div>
    );
}
