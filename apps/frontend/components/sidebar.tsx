"use client";

import {
	Dumbbell,
	LayoutDashboard,
	Lightbulb,
	LoaderCircle,
	LogOut,
	Menu,
	Target,
	TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import useAuth from "@/app/login/auth-context";
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

	return (
		<nav className="flex flex-1 flex-col gap-1">
			{navItems.map((item) => {
				const isActive = pathname === item.href;
				return (
					<Link
						key={item.href}
						href={item.href}
						onClick={onNavigate}
						className={cn(
							"flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors",
							isActive
								? "bg-[#f0f9f0] font-semibold text-green-600"
								: "text-[#4a5a4a] hover:bg-[#f0f9f0]/60 hover:text-green-700",
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

function SidebarLogo() {
	return (
		<div className="flex items-center gap-3 px-3 py-2">
			<Dumbbell className="size-6 text-green-600" />
			<span className="text-lg font-bold text-[#0f1a0f]">FitPlanner</span>
		</div>
	);
}

function UserCard() {
	const { user, isLoading } = useAuth();
	if (isLoading) {
		return (
			<div className="h-full w-full flex justify-center items-center">
				<LoaderCircle size={40} className="animate-spin text-gray-700" />
			</div>
		);
	}
	if (!user) return null;
	return (
		<div className="flex items-center gap-3 rounded-lg bg-[#f8faf8] px-3 py-2.5">
			<Avatar className="size-9 bg-green-600">
				<AvatarFallback className="bg-green-600 text-sm font-semibold text-white">
					{user.nome.charAt(0)}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-col gap-0.5">
				<span className="text-sm font-medium text-[#0f1a0f]">{user.nome}</span>
			</div>
		</div>
	);
}

function LogoutButton() {
	return (
		<Button
			type="button"
			variant={"destructive"}
			onClick={() => {
				localStorage.removeItem("auth_info");
				window.location.href = "/login";
			}}
			className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-50"
		>
			<LogOut className="size-4.5 text-red-500" />
			Sair
		</Button>
	);
}

function MobileSidebar() {
	const [open, setOpen] = useState(false);
	const router = useRouter();
	return (
		<header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-[#e8f0e8] bg-white px-4 md:hidden">
			<Sheet open={open} onOpenChange={setOpen}>
				<SheetTrigger asChild>
					<Button variant="ghost" size="icon-sm" aria-label="Abrir menu">
						<Menu className="size-5 text-[#0f1a0f]" />
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="w-70 bg-white p-0" showCloseButton>
					<SheetHeader className="sr-only">
						<SheetTitle>Menu de navegação</SheetTitle>
					</SheetHeader>
					<div className="flex h-full flex-col gap-2 px-4 py-6">
						<SidebarLogo />
						<Separator className="bg-[#e8f0e8]" />
						<SidebarNav onNavigate={() => setOpen(false)} />
						<UserCard />
						<Separator className="bg-[#e8f0e8]" />
						<LogoutButton />
					</div>
				</SheetContent>
			</Sheet>
			<Dumbbell className="size-5 text-green-600" />
			<span className="text-sm font-semibold text-[#0f1a0f]">FitPlanner</span>
		</header>
	);
}

function DesktopSidebar() {
	return (
		<aside className="hidden md:flex h-full w-65 shrink-0 flex-col gap-2 border-r border-[#e8f0e8] bg-white px-4 py-6">
			<SidebarLogo />
			<Separator className="bg-[#e8f0e8]" />
			<SidebarNav />
			<UserCard />
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
