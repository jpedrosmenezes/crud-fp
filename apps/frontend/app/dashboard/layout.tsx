import { Sidebar } from "@/components/sidebar";

export default function DashboardLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex h-screen flex-col md:flex-row">
			<Sidebar />
			<main className="flex-1 overflow-auto bg-[#f8faf8]">{children}</main>
		</div>
	);
}
