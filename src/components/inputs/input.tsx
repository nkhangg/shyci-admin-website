import { OutlinedInput, OutlinedInputProps } from '@mui/material';
import React from 'react';

export interface IInputProps extends OutlinedInputProps {
    title: string;
}

export default function Input({ title, ...props }: IInputProps) {
    return (
        <div className="flex flex-col justify-center gap-1 w-full">
            <label className="text-md font-medium text-gray-400">{title}</label>
            <OutlinedInput
                sx={{
                    backgroundColor: '#f9f9f9',
                }}
                size="small"
                fullWidth
                {...props}
            />
        </div>
    );
}
