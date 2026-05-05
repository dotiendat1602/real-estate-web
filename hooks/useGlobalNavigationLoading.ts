// "use client";

// import { useEffect, useRef } from 'react';
// import { usePathname, useSearchParams } from 'next/navigation';
// import { useLoading } from '@/contexts/LoadingContext';
// import { useAuth } from '@/contexts/AuthContext';

// export function useGlobalNavigationLoading() {
//     const { startLoading, stopLoading } = useLoading();
//     const { isAuthenticated, isHydrated } = useAuth();
//     const pathname = usePathname();
//     const searchParams = useSearchParams();
//     const prevPathRef = useRef<string>('');
//     const isInitialMount = useRef(true);

//     useEffect(() => {
//         if (isInitialMount.current) {
//             isInitialMount.current = false;
//             prevPathRef.current = pathname + searchParams.toString();
//             return;
//         }

//         const currentPath = pathname + searchParams.toString();

//         if (prevPathRef.current && prevPathRef.current !== currentPath) {
//             const isFromHomeToDashboard = prevPathRef.current.includes('/home') && (pathname.includes('/dashboard') || pathname.includes('/pages/dashboard'));

//             const isDashboardNavigation = pathname.includes('/dashboard') || pathname.includes('/pages/dashboard');

//             if (isFromLoginToDashboard || isDashboardNavigation) {
//                 prevPathRef.current = currentPath;
//                 return;
//             }

//             if (isHydrated && isAuthenticated) {
//                 startLoading();

//                 const timer = setTimeout(() => {
//                     stopLoading();
//                 }, 500);

//                 return () => {
//                     clearTimeout(timer);
//                 };
//             }
//         }

//         prevPathRef.current = currentPath;
//     }, [pathname, searchParams, startLoading, stopLoading, isHydrated, isAuthenticated]);
// } 
