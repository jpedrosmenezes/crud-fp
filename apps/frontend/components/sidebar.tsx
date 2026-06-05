"use client";

import {
	Dumbbell,
	LayoutDashboard,
	Lightbulb,
	LogOut,
	Menu,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const navItems = [
	{ label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
	{ label: "Planos de Treino", href: "/dashboard/planos", icon: Dumbbell },
	{ label: "Metas", href: "/dashboard/metas", icon: Target },
	{ label: "Evolução", href: "/dashboard/evolucao", icon: TrendingUp },
	{ label: "Sugestões", href: "/dashboard/sugestoes", icon: Lightbulb },
];

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
	const pathname = usePathname();
	const [show, setShow] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setShow(true), 80);
		return () => clearTimeout(t);
	}, []);

	return (
		<nav className="flex flex-1 flex-col gap-1">
			{navItems.map((item, i) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={onNavigate}
						style={{ transitionDelay: show ? `${i * 60}ms` : "0ms" }}
						className={cn(
							"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-300 ease-out",
							isActive
								? "bg-[#f0f9f0] font-semibold text-green-600"
								: "text-[#4a5a4a] hover:bg-[#f0f9f0]/60 hover:text-green-700",
							show ? "translate-x-0 opacity-100" : "-translate-x-3 opacity-0",
						)}
					>
						<item.icon
							className={cn(
								"size-4.5",
								isActive ? "text-green-600" : "text-[#4a5a4a]",
							)}
						/>
						{item.label}
					</Link>
				);
			})}
		</nav>
	);
}

function SidebarLogo({ animated }: { animated?: boolean }) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 px-3 py-2 transition-all duration-300 ease-out",
				animated === false
					? ""
					: animated
						? "translate-x-0 opacity-100"
						: "-translate-x-4 opacity-0",
			)}
		>
			<Dumbbell className="size-6 text-green-600" />
			<span className="text-lg font-bold text-[#0f1a0f]">FitPlanner</span>
		</div>
	);
}

function UserCard({ animated }: { animated?: boolean }) {
	return (
		<div
			className={cn(
				"flex items-center gap-3 rounded-lg bg-[#f8faf8] px-3 py-2.5 transition-all duration-300 ease-out",
				animated === false
					? ""
					: animated
						? "translate-x-0 opacity-100"
						: "-translate-x-3 opacity-0",
			)}
		>
			<Avatar className="size-9 bg-green-600">
				<AvatarFallback className="bg-green-600 text-sm font-semibold text-white">
					M
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-0.5">
				<span className="text-sm font-medium text-[#0f1a0f]">
					Ricardo Marinho do Prado
				</span>
			</div>
		</div>
	);
}

function LogoutButton({ onNavigate }: { onNavigate?: () => void }) {
	return (
		<button
			type="button"
			onClick={onNavigate}
			className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
		>
			<LogOut className="size-4.5 text-red-500" />
			Sair
		</button>
	);
}

function MobileSidebar() {
	const [open, setOpen] = useState(false);

	return (
		<header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[#e8f0e8] bg-white px-4 md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon-sm" aria-label="Abrir menu">
						<Menu className="size-5 text-[#0f1a0f]" />
					</Button>
				</SheetTrigger>
				<SheetContent
					side="left"
					className="w-[280px] bg-white p-0"
					showCloseButton
				>
					<SheetHeader className="sr-only">
						<SheetTitle>Menu de navegação</SheetTitle>
					</SheetHeader>
					<div className="flex h-full flex-col gap-2 px-4 py-6">
						<SidebarLogo />
						<Separator className="bg-[#e8f0e8]" />
						<SidebarNav onNavigate={() => setOpen(false)} />
						<UserCard />
						<Separator className="bg-[#e8f0e8]" />
						<LogoutButton onNavigate={() => setOpen(false)} />
					</div>
				</SheetContent>
			</Sheet>
			<Dumbbell className="size-5 text-green-600" />
			<span className="text-sm font-semibold text-[#0f1a0f]">FitPlanner</span>
		</header>
	);
}

function DesktopSidebar() {
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const t = setTimeout(() => setVisible(true), 50);
		return () => clearTimeout(t);
	}, []);

	return (
		<aside
			className={cn(
				"hidden md:flex h-full w-65 shrink-0 flex-col gap-2 border-r border-[#e8f0e8] bg-white px-4 py-6 transition-all duration-500 ease-out",
				visible ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0",
			)}
		>
			<SidebarLogo animated={visible} />
			<Separator
				className={cn(
					"bg-[#e8f0e8] transition-all duration-300 ease-out",
					visible ? "opacity-100" : "opacity-0",
				)}
				style={{ transitionDelay: visible ? "150ms" : "0ms" }}
			/>
			<SidebarNav />
			<UserCard animated={visible} />
			<Separator className="bg-[#e8f0e8]" />
			<LogoutButton />
		</aside>
	);
}

export function Sidebar() {
	return (
		<>
			<MobileSidebar />
			<DesktopSidebar />
		</>
	);
}
