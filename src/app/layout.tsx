import './global.css';
import '@/styles/global.css';

import * as React from 'react';
import type { Metadata, Viewport } from 'next';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import Provider from '@/components/common/provider';

export const viewport = { width: 'device-width', initialScale: 1 } satisfies Viewport;

interface LayoutProps {
    children: React.ReactNode;
}

export const metadata = { title: `Home | Dashboard ` } satisfies Metadata;

export default function Layout({ children }: LayoutProps): React.JSX.Element {
    return (
        <html lang="en">
            <body>
                <Provider>
                    <LocalizationProvider>
                        <UserProvider>
                            <ThemeProvider>{children}</ThemeProvider>
                        </UserProvider>
                    </LocalizationProvider>
                </Provider>
            </body>
        </html>
    );
}
