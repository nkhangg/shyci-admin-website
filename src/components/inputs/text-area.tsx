import { OutlinedInput, TextareaAutosize } from '@mui/material';
import classNames from 'classnames';
import React, { DetailedHTMLProps, forwardRef } from 'react';

export interface ITextAreaProps extends DetailedHTMLProps<React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement> {
    title?: string;
}

const TextArea = forwardRef(function TextArea({ title, ...props }: ITextAreaProps, ref: any) {
    return (
        <div className="flex flex-col justify-center gap-1 w-full text-[#212636] ">
            {title && <label className="text-md font-medium text-gray-400">{title}</label>}
            <textarea
                ref={ref}
                spellCheck={false}
                className={classNames('w-full border focus:border-transparent transition-all ease-linear duration-75 resize-none py-[8.5px] px-[14px] text-[1rem] rounded-lg', {
                    ['hover:border-black']: !props.disabled,
                    ['text-[#8a94a6]']: props.disabled,
                })}
                {...props}
            />
        </div>
    );
});

TextArea.displayName = 'TextArea';

export default TextArea;
