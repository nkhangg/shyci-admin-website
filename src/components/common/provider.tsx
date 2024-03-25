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
    const [queryClient] = React.useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid refetching immediately on the client
                        staleTime: 60 * 1000,
                    },
                },
            }),
    );

    return (
        <ConfirmProvider>
            <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
            <ToastContainer />
        </ConfirmProvider>
    );
}
