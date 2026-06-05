"use client";
import { Clock3, Dumbbell, Flame, LoaderCircle, Target } from "lucide-react";
import { useEffect, useState } from "react";
import useAuth, {
	type Exercicio,
	type Meta,
	type Treino,
} from "../login/auth-context";

export default function DashboardPage() {
	const { user, isLoading, fetchTreinos, fetchMetas, fetchExercicios } =
		useAuth();
	const [treinos, setTreinos] = useState<Treino[] | null>(null);
	const [metas, setMetas] = useState<Meta[] | null>(null);
	const [exercicios, setExercicios] = useState<Exercicio[] | null>(null);
	useEffect(() => {
		fetchTreinos().then(setTreinos).catch(console.error);
		fetchMetas().then(setMetas).catch(console.error);
		fetchExercicios().then(setExercicios).catch(console.error);
	}, [fetchTreinos, fetchMetas, fetchExercicios]);
	if (isLoading && !user && !treinos && !metas && !exercicios) {
		return (
			<div className="h-full w-full flex justify-center items-center">
				<LoaderCircle size={100} className="animate-spin text-gray-700" />
			</div>
		);
	}

	if (user && !isLoading && treinos && metas && exercicios) {
		console.log(treinos);
		const stats = [
			{
				title: "Total de treinos",
				value: treinos?.length,
				icon: Dumbbell,
			},
			{
				title: "Total de Metas",
				value: metas.length,
				icon: Target,
			},
			{
				title: "Total de Exercícios",
				value: exercicios.length,
				icon: Clock3,
			},
		];
		return (
			<div className="min-h-screen bg-[#f8faf8]">
				<div className="flex">
					<main className="flex-1 p-10">
						<div className="mb-8">
							<h2 className="text-4xl font-extrabold">
								Olá, {user.nome || "usuário"}
							</h2>
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
											<span className="text-muted-foreground">
												{stat.title}
											</span>

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
									{treinos.slice(0, 3).map((treino, _) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <>
											key={treino.nome + _}
											className="rounded-xl bg-muted/50 p-4"
										>
											{treino.nome}
										</div>
									))}
								</div>
							</div>

							<div className="rounded-2xl border bg-card p-6 shadow-lg shadow-black/5">
								<h3 className="mb-4 text-xl font-bold">Metas Atuais</h3>

								<div className="space-y-5">
									{metas.slice(0, 3).map((meta, _) => (
										<div
											// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
											key={meta.descricao + _}
											className="flex justify-between"
										>
											<p className="mb-2 font-medium">{meta.descricao}</p>
											<div>
												<p className="mb-2 text-sm text-gray-600">
													{meta.status}
												</p>
												<p className="mb-2 text-sm text-gray-600">
													Prazo: {meta.prazo} dias
												</p>
											</div>
										</div>
									))}
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
		);
	}
}
