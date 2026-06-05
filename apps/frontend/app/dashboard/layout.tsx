"use client";

import { AuthProvider } from "@/app/login/auth-context";
import { Sidebar } from "@/components/sidebar";
import QueryProvider from "@/lib/getQueryClient";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryProvider>
			<AuthProvider>
				<div className="flex h-screen flex-col md:flex-row">
					<Sidebar />
					<main className="flex-1 overflow-auto bg-[#f8faf8]">{children}</main>
				</div>
			</AuthProvider>
		</QueryProvider>
	);
}