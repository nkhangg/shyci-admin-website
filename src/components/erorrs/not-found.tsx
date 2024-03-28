import React from 'react';

export interface INotFoundProps {}

export default function NotFound(props: INotFoundProps) {
    return (
        <div className="flex items-center justify-center py-8">
            <div>Không tìm thấy dữ liệu</div>
        </div>
    );
}
