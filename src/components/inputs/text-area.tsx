import { OutlinedInput, TextareaAutosize } from '@mui/material';
import React, { DetailedHTMLProps } from 'react';

export interface ITextAreaProps extends DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    title: string;
}

export default function TextArea({ title, ...props }: ITextAreaProps) {
    return (
        <div className="flex flex-col justify-center gap-1 w-full text-[#212636] ">
            <label className="text-md font-medium text-gray-400">{title}</label>
            <textarea
                spellCheck={false}
                className="w-full border hover:border-black focus:border-transparent transition-all ease-linear duration-75 resize-none py-[8.5px] px-[14px] text-[1rem] rounded-lg"
                {...props}
            />
        </div>
    );
}
