import {
	LayoutDashboard,
	ListChecks,
	Target,
	TrendingUp,
	Lightbulb,
	Dumbbell,
} from "lucide-react";
import Link from "next/link";

export function Sidebar() {
	return (
		<aside className="flex h-screen w-60 flex-col border-r bg-white">
			<div className="border-b p-6">
				<div className="flex items-center gap-3">
					<Dumbbell className="size-5 text-primary" />
					<span className="font-bold">FitPlanner</span>
				</div>
			</div>

			<nav className="p-3">
				<div className="space-y-1">
					<Link
						href="/dashboard"
						className="flex items-center gap-3 rounded-lg bg-green-50 px-3 py-2 text-sm font-medium text-green-700"
					>
						<LayoutDashboard size={16} />
						Dashboard
					</Link>

					<Link
						href="/planos"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
					>
						<ListChecks size={16} />
						Planos de Treino
					</Link>

					<Link
						href="/metas"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
					>
						<Target size={16} />
						Metas
					</Link>

					<Link
						href="/evolucao"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
					>
						<TrendingUp size={16} />
						Evolução
					</Link>

					<Link
						href="/sugestoes"
						className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
					>
						<Lightbulb size={16} />
						Sugestões
					</Link>
				</div>
			</nav>

			<div className="flex-1" />

			<div className="border-t p-4">
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
						M
					</div>

					<div>
						<p className="text-sm font-medium">Marina</p>
						<p className="text-xs text-muted-foreground">
							Ativo há 7 dias
						</p>
					</div>
				</div>
			</div>
		</aside>
	);
}

