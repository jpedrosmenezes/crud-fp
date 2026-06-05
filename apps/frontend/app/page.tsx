import { Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<header className="flex items-center justify-between h-17.5 px-12 border-b border-border">
				<Link href="/" className="flex items-center gap-2.5">
					<Dumbbell className="size-7 text-primary" />
					<span className="text-xl font-bold text-foreground">FitPlanner</span>
				</Link>
				<Link href="/login">
					<Button
						variant="default"
						className="rounded-[10px] px-7 py-2.5 h-auto text-sm font-semibold shadow-md shadow-primary/30"
					>
						Começar
					</Button>
				</Link>
			</header>

			<main className="flex-1 flex flex-col items-center justify-center px-12 py-20 text-center gap-6">
				<span className="inline-flex items-center gap-1.5 text-sm font-medium text-primary bg-primary/10 px-4 py-1.5 rounded-full">
					<span className="text-base">🏋️</span>
					Sua jornada fitness começa aqui
				</span>

				<h1 className="text-5xl sm:text-6xl font-bold text-foreground tracking-tight max-w-3xl leading-tight">
					Transforme sua rotina de treinos
				</h1>

				<p className="text-lg text-muted-foreground max-w-150 leading-relaxed">
					Planeje seus treinos, acompanhe sua evolução e alcance suas metas com
					recomendações inteligentes.
				</p>

				<div className="flex items-center gap-4 pt-2">
					<Link href="/login">
						<Button
							variant="default"
							size="lg"
							className="rounded-xl px-8 py-3 h-auto text-base font-semibold shadow-lg shadow-primary/30"
						>
							Começar Agora
						</Button>
					</Link>
				</div>
			</main>

			<footer className="flex items-center justify-center py-6 px-12">
				<p className="text-sm text-muted-foreground">
					&copy; 2026 FitPlanner. Todos os direitos reservados.
				</p>
			</footer>
		</div>
	);
}
