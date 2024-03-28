import React, { ReactNode } from 'react';
import cls from 'classnames';

export interface ICustomBoxProps {
    title: string;
    children?: ReactNode;
    classnames?: { parent?: string; body?: string };
    actions?: ReactNode;
}

export default function CustomBox({ title, children, classnames, actions }: ICustomBoxProps) {
    return (
        <div
            className={cls('w-full rounded-lg shadow-box border px-5 pt-7 pb-5 flex flex-col justify-between gap-4 ', {
                [classnames?.parent || '']: !!classnames?.parent,
            })}
        >
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-medium">{title}</h2>
                {actions}
            </div>

            <div
                className={cls('w-full', {
                    [classnames?.body || '']: !!classnames?.body,
                })}
            >
                {children}
            </div>
        </div>
    );
}
