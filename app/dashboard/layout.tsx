"use client";

import React from "react";
import Sidebar from "@/app/sidebar";

export default function DashboardLayout({
        children,
    }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main className="container mx-auto mt-12">
            <div className="flex gap-8">
                <div className="w-full">
                    {children}
                </div>
            </div>
        </main>
    )
}
