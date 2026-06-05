import { Check, ChevronLeft, Dumbbell } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const features = [
	"Planos de treino personalizados",
	"Acompanhamento de evolução",
	"Metas e objetivos claros",
	"Sugestões inteligentes",
];

export default function LoginPage() {
	return (
		<div className="flex min-h-screen">
			<div className="relative hidden w-[45%] flex-col items-center justify-center gap-6 bg-linear-to-br from-primary to-green-800 p-16 text-white lg:flex">
				<div className="absolute -top-16 -left-16 size-72 rounded-full bg-white/10" />
				<div className="absolute bottom-32 right-4 size-56 rounded-full bg-white/5" />
				<div className="relative z-10 flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-4">
						<Dumbbell className="size-14" strokeWidth={2.5} />
						<h1 className="text-4xl font-bold tracking-tight">FitPlanner</h1>
					</div>
					<p className="max-w-105 text-balance text-center text-lg leading-relaxed text-white/90">
						Organize sua rotina fitness de forma prática
					</p>
					<div className="mt-4 flex flex-col gap-3">
						{features.map((feature) => (
							<div key={feature} className="flex items-center gap-3">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20">
									<Check className="size-3.5" />
								</div>
								<span className="text-base">{feature}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center p-10 lg:p-16">
				<div className="w-full max-w-105 rounded-2xl border bg-card p-12 shadow-2xl shadow-black/5">
					<div className="flex flex-col gap-6">
						<Link
							href="/"
							className="-ml-2 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							<ChevronLeft className="size-5" />
							Voltar
						</Link>
						<div>
							<h2 className="text-[26px] font-extrabold tracking-tight text-foreground">
								Bem-vindo ao FitPlanner
							</h2>
							<p className="mt-1 text-base leading-relaxed text-muted-foreground">
								Digite seu nome para começar sua jornada fitness
							</p>
						</div>

						<div className="flex flex-col gap-2">
							<Label
								htmlFor="name"
								className="text-sm font-medium text-foreground"
							>
								Seu nome
							</Label>
							<Input
								id="name"
								placeholder="Ex: Marina"
								className="h-12 rounded-[10px] border-border bg-[#f8faf8] text-base"
							/>
						</div>

						<Link href="/dashboard">
							<Button className="h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-lg shadow-primary/30">
								Começar Minha Jornada
							</Button>
						</Link>

						<p className="text-center text-xs text-muted-foreground">
							Seus dados ficam salvos apenas no seu dispositivo
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
