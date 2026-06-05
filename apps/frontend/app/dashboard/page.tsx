"use client";
import { Clock3, Dumbbell, LoaderCircle, Target } from "lucide-react";
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
		if (user) {
			Promise.all([fetchTreinos(), fetchMetas(), fetchExercicios()])
				.then(([t, m, e]) => {
					setTreinos(t);
					setMetas(m);
					setExercicios(e);
				})
				.catch(console.error);
		}
	}, [user, fetchTreinos, fetchMetas, fetchExercicios]);

	if (isLoading || !treinos || !metas || !exercicios) {
		return (
			<div className="flex h-full items-center justify-center">
				<LoaderCircle className="size-10 animate-spin text-[#4a5a4a]" />
			</div>
		);
	}

	if (!user) return null;

	const stats = [
		{ title: "Treinos", value: treinos.length, icon: Dumbbell },
		{ title: "Metas", value: metas.length, icon: Target },
		{ title: "Exercícios", value: exercicios.length, icon: Clock3 },
		{
			title: "Sequência",
			value: (() => {
				if (!metas.length) return "0 dias";
				const completed = metas.filter((m) => m.status === "Concluída").length;
				return `${completed} concluída${completed !== 1 ? "s" : ""}`;
			})(),
			icon: Target,
		},
	];

	const statusColors: Record<string, string> = {
		"Em andamento": "bg-blue-50 text-blue-700",
		Concluída: "bg-green-50 text-green-700",
		Pendente: "bg-amber-50 text-amber-700",
	};

	return (
		<div className="p-6 md:p-10">
			<div className="mb-8">
				<h2 className="text-2xl font-bold text-[#0f1a0f]">Olá, {user.nome}!</h2>
				<p className="text-sm text-[#6a7a6a]">
					Aqui está o resumo da sua evolução fitness
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
				{stats.map((stat) => {
					const Icon = stat.icon;
					return (
						<div
							key={stat.title}
							className="rounded-2xl border bg-white p-5 shadow-sm"
						>
							<div className="mb-3 flex items-center justify-between">
								<span className="text-sm text-[#6a7a6a]">{stat.title}</span>
								<div className="flex size-8 items-center justify-center rounded-lg bg-green-50">
									<Icon className="size-4 text-green-600" />
								</div>
							</div>
							<p className="text-2xl font-bold text-[#0f1a0f]">{stat.value}</p>
						</div>
					);
				})}
			</div>

			<div className="mt-6 grid gap-6 lg:grid-cols-2">
				<div className="rounded-2xl border bg-white p-6 shadow-sm">
					<h3 className="mb-4 text-lg font-semibold text-[#0f1a0f]">
						Treinos Recentes
					</h3>
					{treinos.length === 0 ? (
						<p className="text-sm text-[#8a9a8a]">Nenhum treino cadastrado</p>
					) : (
						<div className="flex flex-col gap-3">
							{treinos.slice(0, 5).map((treino, _) => (
								<div
									key={treino.nome + String(_)}
									className="flex items-center justify-between rounded-xl bg-[#f8faf8] p-3"
								>
									<div className="flex items-center gap-3">
										<div className="flex size-8 items-center justify-center rounded-lg bg-green-50">
											<Dumbbell className="size-4 text-green-600" />
										</div>
										<span className="font-medium text-[#0f1a0f]">
											{treino.nome}
										</span>
									</div>
									{treino.tipo && (
										<span className="text-xs text-[#6a7a6a]">
											{treino.tipo}
										</span>
									)}
								</div>
							))}
						</div>
					)}
				</div>

				<div className="rounded-2xl border bg-white p-6 shadow-sm">
					<h3 className="mb-4 text-lg font-semibold text-[#0f1a0f]">
						Suas Metas
					</h3>
					{metas.length === 0 ? (
						<p className="text-sm text-[#8a9a8a]">Nenhuma meta cadastrada</p>
					) : (
						<div className="flex flex-col gap-3">
							{metas.slice(0, 5).map((meta, i) => (
								<div
									key={`${meta.descricao}-${
										// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
										i
									}`}
									className="flex items-center justify-between rounded-xl bg-[#f8faf8] p-3"
								>
									<span className="font-medium text-[#0f1a0f]">
										{meta.descricao}
									</span>
									<span
										className={`rounded-lg px-2.5 py-1 text-xs font-medium ${statusColors[meta.status ?? "Pendente"] ?? "bg-gray-50 text-gray-700"}`}
									>
										{meta.status ?? "Pendente"}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
