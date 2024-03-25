import React, { DetailedHTMLProps, ReactNode } from 'react';

export interface IInputIconProps extends DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    title: string;
    icon: ReactNode;
}

export default function InputIcon({ title, icon, ...props }: IInputIconProps) {
    return (
        <div className="flex flex-col justify-center gap-1 w-full text-[#212636] ">
            <label className="text-md font-medium text-gray-400">{title}</label>
            <div className="flex items-center gap-2 w-full focus-within:border-[#635bff] focus-within:border-2 px-[8.5px] h-[40px] border transition-all ease-linear duration-75  text-[1rem] rounded-lg overflow-hidden">
                {icon}
                <input
                    autoComplete="off"
                    style={{
                        outline: 'none',
                    }}
                    spellCheck={false}
                    className="w-full flex-1 h-full pl-[8.5px] px-[14px] outline-none"
                    {...props}
                />
            </div>
        </div>
    );
}
