import { Hoodie, Money, Storefront, Tag, Trash } from '@phosphor-icons/react/dist/ssr';
import classNames from 'classnames';
import React from 'react';
import { ISize } from '../../../../interface';
import { toCurrency } from '@/ultils/funtions';

export interface ISizeItemProps {
    data: ISize;
    active?: boolean;
    onClick?: (data: ISize) => void;
    onDelete?: (data: ISize) => void;
}

export default function SizeItem({ active, data, onClick, onDelete }: ISizeItemProps) {
    return (
        <div
            onClick={onClick ? () => onClick(data) : undefined}
            className={classNames('p-4 select-none rounded-lg border-2 relative hover:border-violet-400 transition-all ease-out cursor-pointer', {
                ['border-violet-400']: active,
            })}
        >
            <div
                className="absolute top-0 right-0 flex items-center gap-2 p-2 select-none"
                onClick={
                    onDelete
                        ? (e) => {
                              e.stopPropagation();
                              onDelete(data);
                          }
                        : undefined
                }
            >
                <Trash className="hover:text-heart cursor-pointer" />
            </div>
            <ul className="flex flex-col gap-2">
                <li className="flex items-center gap-4 text-sm">
                    <span className="w-4 h-4">
                        <Hoodie />
                    </span>
                    <span>{data.name}</span>
                </li>
                <li className="flex items-center gap-4 text-sm">
                    <span className="w-4 h-4">
                        <Money />
                    </span>
                    <span>{toCurrency(data.price)}</span>
                </li>
                <li className="flex items-center gap-4 text-sm ">
                    <span className="w-4 h-4">
                        <Storefront />
                    </span>
                    <p className="text-wrap break-all">{data.store}</p>
                </li>
                <li className="flex items-center gap-4 text-sm">
                    <span className="w-4 h-4">
                        <Tag />
                    </span>
                    <span>{data.discount}%</span>
                </li>
            </ul>
        </div>
    );
}
