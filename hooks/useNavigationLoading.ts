"use client";

import { useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLoading } from '@/contexts/LoadingContext';

export function useNavigationLoading() {
    const { startLoading, stopLoading } = useLoading();
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        if (isPending) {
            const isFromLogin = sessionStorage.getItem("ssoLoginInProgress") === "true";
            if (isFromLogin) {
                return;
            }
            startLoading();
        } else {
            const timer = setTimeout(() => {
                stopLoading();
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isPending, startLoading, stopLoading]);

    const navigateWithLoading = (href: string) => {
        startTransition(() => {
            router.push(href);
        });
    };

    return { navigateWithLoading, isPending };
} 