import { CaretLeft, CaretRight } from '@phosphor-icons/react/dist/ssr';
import React from 'react';
import classNames from 'classnames';
import { IPagination } from '../../../interface';

export interface IPaginationProps {
    data: IPagination<any>['meta'];
    onNext?: (data: IPagination<any>['meta']) => void;
    onPrev?: (data: IPagination<any>['meta']) => void;
    onDeletes?: () => void;
}

export default function Pagination({ data, onNext, onPrev, onDeletes }: IPaginationProps) {
    return (
        <div className="w-full flex items-center justify-between p-4 gap-5 text-sm select-none">
            <div className="pl-5">
                <span
                    onClick={onDeletes}
                    className={classNames('', {
                        ['text-gray-300']: !onDeletes,
                        ['text-heart hover:underline cursor-pointer']: onDeletes != undefined,
                    })}
                >
                    Delete
                </span>
            </div>
            <div className="flex items-center gap-5">
                <span>
                    {data.currentPage} / {data.totalPages}
                </span>

                <div className="flex items-center gap-5">
                    <div
                        onClick={onPrev && data.currentPage > 1 ? () => onPrev(data) : undefined}
                        className={classNames('p-2 rounded transition-all ease-linear  ', {
                            ['hover:bg-gray-400 active:scale-95 cursor-pointer']: data.currentPage > 1,
                            ['text-gray-300']: data.currentPage <= 1,
                        })}
                    >
                        <CaretLeft />
                    </div>
                    <div
                        onClick={onNext && data.currentPage < data.totalPages ? () => onNext(data) : undefined}
                        className={classNames('p-2 rounded transition-all ease-linear ', {
                            ['hover:bg-gray-400 active:scale-95 cursor-pointer']: data.currentPage < data.totalPages,
                            ['text-gray-300']: data.currentPage == data.totalPages,
                        })}
                    >
                        <CaretRight />
                    </div>
                </div>
            </div>
        </div>
    );
}
