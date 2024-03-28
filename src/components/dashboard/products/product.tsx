/* eslint-disable @next/next/no-img-element */
import { formatNumber, toCurrency, totalQuantities } from '@/ultils/funtions';
import React, { useState } from 'react';
import { IDProduct } from '../../../../interface';
import { constants } from '@/components/common/constants';
import Link from 'next/link';
import { paths } from '@/paths';
import classNames from 'classnames';

export interface IProductProps {
    onClick?: (data: IDProduct) => void;
    data: IDProduct;
    options?: {
        disableLink?: boolean;
    };
}

export default function Product({ data, options = { disableLink: false }, onClick }: IProductProps) {
    const [image, setImage] = useState(data.images[0].name);

    return (
        <div
            onClick={onClick ? () => onClick(data) : undefined}
            className={classNames('w-full h-fit flex flex-col justify-between rounded overflow-hidden shadow-box hover:shadow-box-fill transition-all ease-linear', {
                ['cursor-pointer']: onClick,
            })}
        >
            <div className="w-full aspect-square overflow-hidden mix-blend-multiply">
                <img
                    onError={() => {
                        setImage(constants.imageDisplayWhenErorr);
                    }}
                    className="w-full h-full object-cover mix-blend-multiply"
                    src={image}
                    alt={image}
                />
            </div>

            <div className="py-1 pb-4 px-4 text-md flex flex-col gap-1">
                {!options.disableLink && (
                    <Link href={paths.dashboard.products + `/${data.id}`} className="hover:underline cursor-pointer text-lg font-medium text-[#333] line-clamp-1">
                        {data.name}
                    </Link>
                )}

                {options.disableLink && <h2 className="hover:underline cursor-pointer text-lg font-medium text-[#333] line-clamp-1"> {data.name}</h2>}

                <span className="flex items-center gap-2 ">
                    <span>Giá:</span>
                    <p>{toCurrency(data.sizes[0].price)}</p>
                </span>
                <span className="flex items-center gap-2">
                    <span>Giảm giá:</span>
                    <p>{data.sizes[0].discount}%</p>
                </span>

                <span className="">Số size: {data.sizes.length}</span>
                <span className="">Số lượng: {formatNumber(totalQuantities(data.sizes))}</span>
            </div>
        </div>
    );
}
