import React, { ReactNode } from 'react';

export interface ITitleBoxProps {
    title: string;
    children: ReactNode;
    className?: string;
    action?: ReactNode;
}

export default function TitleBox({ children, title, className, action }: ITitleBoxProps) {
    return (
        <div className="flex flex-col justify-center gap-1 w-full text-[#212636]">
            <div className="flex ic justify-between">
                <span className="text-md font-medium text-gray-400">{title}</span>
                {action}
            </div>
            <div className={className}>{children}</div>
        </div>
    );
}
