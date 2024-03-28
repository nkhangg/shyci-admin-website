'use client';
import React, { ReactNode, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfirmProvider } from 'material-ui-confirm';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export interface IProviderProps {
    children: ReactNode;
}

export default function Provider({ children }: IProviderProps) {
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <ConfirmProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            <ToastContainer />
        </ConfirmProvider>
    );
}
