import { Clock3, Dumbbell, Flame, Target } from "lucide-react";

const stats = [
	{
		title: "Treinos da Semana",
		value: "12",
		icon: Dumbbell,
	},
	{
		title: "Meta de Peso",
		value: "78kg",
		icon: Target,
	},
	{
		title: "Horas Treinadas",
		value: "24h",
		icon: Clock3,
	},
	{
		title: "Sequência Atual",
		value: "18 dias",
		icon: Flame,
	},
];

export default function DashboardPage() {
	return (
		<div className="min-h-screen bg-[#f8faf8]">
			<div className="flex">
				<main className="flex-1 p-10">
					<div className="mb-8">
						<h2 className="text-4xl font-extrabold">Olá, ---</h2>
						<p className="text-muted-foreground">
							Acompanhe sua evolução fitness.
						</p>
					</div>

					<div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
						{stats.map((stat) => {
							const Icon = stat.icon;

							return (
								<div
									key={stat.title}
									className="rounded-2xl border bg-card p-6 shadow-lg shadow-black/5"
								>
									<div className="mb-4 flex justify-between">
										<span className="text-muted-foreground">{stat.title}</span>

										<Icon className="text-primary" />
									</div>

									<h3 className="text-3xl font-bold">{stat.value}</h3>
								</div>
							);
						})}
					</div>

					<div className="mt-8 grid gap-6 lg:grid-cols-2">
						<div className="rounded-2xl border bg-card p-6 shadow-lg shadow-black/5">
							<h3 className="mb-4 text-xl font-bold">Treinos Recentes</h3>

							<div className="space-y-4">
								<div className="rounded-xl bg-muted/50 p-4">
									Treino A - Peito e Tríceps
								</div>

								<div className="rounded-xl bg-muted/50 p-4">
									Treino B - Costas e Bíceps
								</div>

								<div className="rounded-xl bg-muted/50 p-4">
									Cardio Moderado
								</div>
							</div>
						</div>

						<div className="rounded-2xl border bg-card p-6 shadow-lg shadow-black/5">
							<h3 className="mb-4 text-xl font-bold">Metas Atuais</h3>

							<div className="space-y-5">
								<div>
									<p className="mb-2 font-medium">Perder 5kg</p>

									<div className="h-3 rounded-full bg-muted">
										<div className="h-3 w-[70%] rounded-full bg-primary" />
									</div>
								</div>

								<div>
									<p className="mb-2 font-medium">20 treinos este mês</p>

									<div className="h-3 rounded-full bg-muted">
										<div className="h-3 w-[55%] rounded-full bg-primary" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</main>
			</div>
		</div>
	);
}
