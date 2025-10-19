import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    className = "",
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Ensure currentPage is within valid range
    const safeCurrentPage = Math.max(1, Math.min(currentPage, totalPages));

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, safeCurrentPage - delta);
            i <= Math.min(totalPages - 1, safeCurrentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (safeCurrentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (safeCurrentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className={`flex items-center justify-center space-x-1 ${className}`}>
            {/* Previous Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(safeCurrentPage - 1)}
                disabled={safeCurrentPage === 1}
                className="h-8 w-8 p-0"
            >
                <ChevronLeft className="h-4 w-4" />
            </Button>

            {/* Page Numbers */}
            {visiblePages.map((page, index) => {
                if (page === "...") {
                    return (
                        <Button
                            key={`dots-${index}`}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            disabled
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    );
                }

                const pageNumber = page as number;
                return (
                    <Button
                        key={pageNumber}
                        variant={safeCurrentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => onPageChange(pageNumber)}
                        className={`h-8 w-8 p-0 ${safeCurrentPage === pageNumber
                                ? "bg-purple-600 hover:bg-purple-700 text-white"
                                : "hover:bg-gray-50"
                            }`}
                    >
                        {pageNumber}
                    </Button>
                );
            })}

            {/* Next Button */}
            <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(safeCurrentPage + 1)}
                disabled={safeCurrentPage === totalPages}
                className="h-8 w-8 p-0"
            >
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
