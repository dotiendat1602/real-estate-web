"use client";

import React, { ReactNode, useEffect, useCallback, useState } from "react";
// import { useGlobalNavigationLoading } from "@/hooks/useGlobalNavigationLoading";
import ContentWrapper from "../ContentWrapper";
// import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Sidebar } from "../layout/SideBar";


interface ProtectedLayoutProps {
    children: ReactNode;
}

function ProtectedLayout({ children }: ProtectedLayoutProps) {
    // const { isHydrated, isAuthenticated } = useAuth();
    const router = useRouter();
    const locale = useLocale();

    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = useCallback(() => {
        setCollapsed((c) => !c);
    }, []);

    // useGlobalNavigationLoading();

    // useEffect(() => {
    //     if (isHydrated && !isAuthenticated) {
    //         router.replace(`/${locale}/auth/login`);
    //     }
    // }, [isHydrated, isAuthenticated, router, locale]);

    // if (!isHydrated || !isAuthenticated) {
    //     return null;
    // }

    return (
        <div className="flex min-h-screen text-gray-800">
            <aside
                className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${collapsed ? "w-16" : "w-64"}`}
            >
                <Sidebar collapsed={collapsed} toggleCollapsed={toggleCollapsed} />
            </aside>

            <div
                className={`flex flex-col flex-1 transition-all duration-300 ${collapsed ? "ml-16" : "ml-64"}`}
            >
                <main className="p-4">
                    <ContentWrapper>{children}</ContentWrapper>
                </main>
            </div>
        </div>
    );
}

export default ProtectedLayout;
