'use client';
import { paths } from '@/paths';
import { getToken } from '@/ultils/local-storege';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
    redirect('/dashboard');
}
