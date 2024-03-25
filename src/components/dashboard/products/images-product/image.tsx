'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from 'react';
import { IImageProduct } from '../../../../../interface';
import { Checkbox } from '@mui/material';

export interface IImageProductItemProps {
    data: IImageProduct;
    onDelete?: (data: IImageProduct) => void;
    onRestore?: (data: IImageProduct) => void;
    checked?: boolean;
}

export default function ImageProductItem({ data, checked, onDelete, onRestore }: IImageProductItemProps) {
    const [deleted, setDeleted] = useState(false);

    useEffect(() => {
        if (checked === undefined) return;

        setDeleted(checked);
    }, [checked]);

    return (
        <div
            onClick={(e) => {
                e.stopPropagation();
                setDeleted((prev) => !prev);
                if (!onDelete || !onRestore) return;

                if (deleted) {
                    onRestore(data);
                } else {
                    onDelete(data);
                }
            }}
            className="relative rounded-lg overflow-hidden aspect-square cursor-pointer"
        >
            <img style={{ objectFit: 'cover' }} className="w-full h-full " src={data.name} alt={data.name} />

            <div className="absolute top-0 right-0 ">
                <Checkbox checked={deleted} size="small" />
            </div>
        </div>
    );
}
