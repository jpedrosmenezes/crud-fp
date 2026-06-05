"use client";

import useAuth, { type Treino } from "@/app/login/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dumbbell, Lightbulb, LoaderCircle } from "lucide-react";
import { useEffect, useState } from "react";

export default function SugestoesPage() {
	const { user, isLoading, fetchSugestoes, sugestoes } = useAuth();
	const [loading, setLoading] = useState(true);
	const [objetivo, setObjetivo] = useState<string>("");

	useEffect(() => {
		if (user) {
			fetchSugestoes(objetivo || undefined).finally(() => setLoading(false));
		}
	}, [user]);

	async function handleFilter(obj: string) {
		setObjetivo(obj);
		setLoading(true);
		await fetchSugestoes(obj || undefined);
		setLoading(false);
	}

	if (isLoading || loading) {
		return (
			<div className="flex h-full items-center justify-center">
				<LoaderCircle className="size-10 animate-spin text-[#4a5a4a]" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f8faf8] p-6 md:p-10">
			<div className="mb-8">
				<h1 className="text-2xl font-bold text-[#0f1a0f]">Sugestões</h1>
				<p className="text-sm text-[#6a7a6a]">Recomendações de treinos com base no seu perfil</p>
			</div>

			<div className="mb-6 flex gap-2">
				{[
					{ label: "Todos", value: "" },
					{ label: "Hipertrofia", value: "Hipertrofia" },
					{ label: "Emagrecimento", value: "Emagrecimento" },
				].map((item) => (
					<button
						key={item.value}
						type="button"
						onClick={() => handleFilter(item.value)}
						className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
							objetivo === item.value
								? "bg-green-600 text-white"
								: "bg-white text-[#4a5a4a] hover:bg-[#f0f9f0] border border-[#e8f0e8]"
						}`}
					>
						{item.label}
					</button>
				))}
			</div>

			{sugestoes.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 shadow-sm">
					<Lightbulb className="size-12 text-[#4a5a4a]/30" />
					<p className="mt-4 text-[#4a5a4a]">Nenhuma sugestão disponível</p>
					<p className="text-sm text-[#8a9a8a]">Crie treinos para receber recomendações personalizadas</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{sugestoes.map((treino: Treino, i: number) => (
						<div
							key={`${treino.nome}-${i}`}
							className="rounded-2xl border bg-white p-5 shadow-sm"
						>
							<div className="flex items-start justify-between">
								<div className="flex items-center gap-3">
									<div className="flex size-10 items-center justify-center rounded-xl bg-amber-50">
										<Lightbulb className="size-5 text-amber-600" />
									</div>
									<div>
										<h3 className="font-semibold text-[#0f1a0f]">{treino.nome}</h3>
										<div className="flex items-center gap-2 text-sm text-[#6a7a6a]">
											{treino.tipo && <span>{treino.tipo}</span>}
											{treino.duracao && (
												<>
													{treino.tipo && <span className="text-[#8a9a8a]">·</span>}
													<span>{treino.duracao}</span>
												</>
											)}
										</div>
									</div>
								</div>
								{treino.objetivo && (
									<Badge variant="secondary" className="border border-[#e8f0e8]">
										{treino.objetivo}
									</Badge>
								)}
							</div>
							{(treino.meta || treino.objetivo) && (
								<div className="mt-3 rounded-lg bg-[#f8faf8] p-3">
									{treino.objetivo && (
										<p className="text-sm">
											<span className="font-medium text-[#0f1a0f]">Objetivo:</span>{" "}
											<span className="text-[#4a5a4a]">{treino.objetivo}</span>
										</p>
									)}
									{treino.meta && (
										<p className="text-sm">
											<span className="font-medium text-[#0f1a0f]">Meta:</span>{" "}
											<span className="text-[#4a5a4a]">{treino.meta}</span>
										</p>
									)}
								</div>
							)}
						</div>
					))}
				</div>
			)}
		</div>
	);
}