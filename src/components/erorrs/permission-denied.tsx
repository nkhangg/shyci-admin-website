import React from 'react';

export interface IPermissionDeniedProps {}

export default function PermissionDenied(props: IPermissionDeniedProps) {
    return (
        <div className="w-full flex items-center justify-center">
            <div className="w-fit py-8 px-10 border border-gray-600 rounded-md flex flex-col items-center justify-center gap-2">
                <h1 className="text-2xl font-bold">403</h1>
                <h4 className="text-xl font-medium">Forbiden</h4>
                <span className="text-lg">Bạn không có quyền sử dụng chức năng này</span>
            </div>
        </div>
    );
}
