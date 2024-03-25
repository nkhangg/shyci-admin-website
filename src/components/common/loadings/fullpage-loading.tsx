import { CircularProgress } from '@mui/material';
import * as React from 'react';

export interface IFullpageLoadingProps {}

export default function FullpageLoading(props: IFullpageLoadingProps) {
    return (
        <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,.4)] z-[999999999]">
            <CircularProgress />
        </div>
    );
}
