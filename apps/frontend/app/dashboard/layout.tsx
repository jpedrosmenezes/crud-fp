"use client";
import { redirect } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	useEffect(() => {
		if (typeof window !== "undefined") {
			const user = localStorage.getItem("auth_info");
			if (!user) redirect("/login");
		}
	}, []);

	return (
		<div className="flex h-screen">
			<Sidebar />
			<main className="flex-1 overflow-auto bg-[#f8faf8]">{children}</main>
		</div>
	);
}
