"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
	ChevronDown,
	ChevronUp,
	Dumbbell,
	LoaderCircle,
	Plus,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useAuth, { type Exercicio, type Treino } from "@/app/login/auth-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const treinoSchema = z.object({
	nome: z
		.string()
		.min(1, "O nome é obrigatório.")
		.max(64, "O nome pode ter no máximo 64 caracteres."),
	tipo: z.string(),
	data: z.string(),
	duracao: z.string(),
	objetivo: z.string(),
	meta: z.string(),
});

type TreinoFormData = z.infer<typeof treinoSchema>;

function CreateTreinoDialog({ onCreated }: { onCreated: () => void }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { createTreino } = useAuth();
	const { control, handleSubmit, reset } = useForm<TreinoFormData>({
		resolver: zodResolver(treinoSchema as any),
		defaultValues: {
			nome: "",
			tipo: "",
			data: "",
			duracao: "",
			objetivo: "",
			meta: "",
		},
	});

	async function onSubmit(data: TreinoFormData) {
		setLoading(true);
		try {
			await createTreino({
				nome: data.nome,
				tipo: data.tipo || null,
				data: data.data || null,
				duracao: data.duracao || null,
				objetivo: data.objetivo || null,
				meta: data.meta || null,
			});
			reset();
			setOpen(false);
			onCreated();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				setOpen(v);
				if (!v) reset();
			}}
		>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-1.5">
					<Plus className="size-4" />
					Novo Treino
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Novo Treino</DialogTitle>
				<DialogDescription>Preencha os dados do treino</DialogDescription>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Controller
							name="nome"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Label htmlFor="nome">Nome *</Label>
									<Input id="nome" placeholder="Ex: Treino A" {...field} />
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</>
							)}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Controller
							name="tipo"
							control={control}
							render={({ field }) => (
								<>
									<Label htmlFor="tipo">Tipo</Label>
									<Input id="tipo" placeholder="Ex: Força, Cardio" {...field} />
								</>
							)}
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<div className="flex flex-col gap-1.5">
							<Controller
								name="data"
								control={control}
								render={({ field }) => (
									<>
										<Label htmlFor="data">Data</Label>
										<Input id="data" type="date" {...field} />
									</>
								)}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Controller
								name="duracao"
								control={control}
								render={({ field }) => (
									<>
										<Label htmlFor="duracao">Duração</Label>
										<Input id="duracao" placeholder="Ex: 60 min" {...field} />
									</>
								)}
							/>
						</div>
					</div>
					<div className="flex flex-col gap-1.5">
						<Controller
							name="objetivo"
							control={control}
							render={({ field }) => (
								<>
									<Label htmlFor="objetivo">Objetivo</Label>
									<Input
										id="objetivo"
										placeholder="Ex: Hipertrofia"
										{...field}
									/>
								</>
							)}
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Controller
							name="meta"
							control={control}
							render={({ field }) => (
								<>
									<Label htmlFor="meta">Meta</Label>
									<Input
										id="meta"
										placeholder="Ex: Aumentar massa muscular"
										{...field}
									/>
								</>
							)}
						/>
					</div>
					<Button type="submit" disabled={loading} className="mt-2 gap-1.5">
						{loading && <LoaderCircle className="size-4 animate-spin" />}
						{loading ? "Criando..." : "Criar Treino"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

const exercicioSchema = z.object({
	nome: z
		.string()
		.min(1, "O nome é obrigatório.")
		.max(64, "O nome pode ter no máximo 64 caracteres."),
	series: z.string(),
	repeticoes: z.string(),
});

type ExercicioFormData = z.infer<typeof exercicioSchema>;

function AddExercicioForm({
	treinoNome,
	onAdded,
}: {
	treinoNome: string;
	onAdded: () => void;
}) {
	const { createExercicio } = useAuth();
	const [loading, setLoading] = useState(false);
	const { control, handleSubmit, reset } = useForm<ExercicioFormData>({
		resolver: zodResolver(exercicioSchema as any),
		defaultValues: {
			nome: "",
			series: "",
			repeticoes: "",
		},
	});

	async function onSubmit(data: ExercicioFormData) {
		setLoading(true);
		try {
			await createExercicio({
				nome: data.nome,
				treino: treinoNome,
				modo: null,
				series: data.series || null,
				repeticoes: data.repeticoes || null,
				tempo: null,
				distancia: null,
			});
			reset();
			onAdded();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<form
			onSubmit={handleSubmit(onSubmit)}
			className="flex flex-col gap-3 rounded-lg border border-dashed border-[#e8f0e8] p-4"
		>
			<p className="text-xs font-medium text-[#4a5a4a]">Adicionar exercício</p>
			<div className="flex flex-col gap-1.5">
				<Controller
					name="nome"
					control={control}
					render={({ field, fieldState }) => (
						<>
							<Input
								placeholder="Nome do exercício"
								className="h-8 text-sm"
								{...field}
							/>
							{fieldState.invalid && <FieldError errors={[fieldState.error]} />}
						</>
					)}
				/>
			</div>
			<div className="grid grid-cols-2 gap-2">
				<Controller
					name="series"
					control={control}
					render={({ field }) => (
						<Input placeholder="Séries" className="h-8 text-sm" {...field} />
					)}
				/>
				<Controller
					name="repeticoes"
					control={control}
					render={({ field }) => (
						<Input
							placeholder="Repetições"
							className="h-8 text-sm"
							{...field}
						/>
					)}
				/>
			</div>
			<Button
				type="submit"
				size="sm"
				disabled={loading}
				variant="outline"
				className="gap-1.5"
			>
				{loading ? (
					<LoaderCircle className="size-3 animate-spin" />
				) : (
					<Plus className="size-3" />
				)}
				{loading ? "Adicionando..." : "Adicionar"}
			</Button>
		</form>
	);
}

export default function PlanosPage() {
	const {
		user,
		isLoading,
		fetchTreinos,
		deleteTreino,
		fetchExercicios,
		deleteExercicio,
	} = useAuth();
	const [treinos, setTreinos] = useState<Treino[]>([]);
	const [exercicios, setExercicios] = useState<Exercicio[]>([]);
	const [loading, setLoading] = useState(true);
	const [expanded, setExpanded] = useState<Set<string>>(new Set());

	const [deleteTarget, setDeleteTarget] = useState<{
		type: "treino" | "exercicio";
		name?: string;
		index?: number;
	} | null>(null);
	const [, setDeleting] = useState(false);

	async function loadData() {
		try {
			const [t, e] = await Promise.all([fetchTreinos(), fetchExercicios()]);
			setTreinos(t);
			setExercicios(e);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (user) loadData();
	}, [user]);

	async function handleConfirmDelete() {
		if (!deleteTarget) return;
		setDeleting(true);
		try {
			if (deleteTarget.type === "treino" && deleteTarget.name) {
				await deleteTreino(deleteTarget.name);
			} else if (
				deleteTarget.type === "exercicio" &&
				deleteTarget.index !== undefined
			) {
				await deleteExercicio(deleteTarget.index);
			}
			setDeleteTarget(null);
			await loadData();
		} catch (err) {
			console.error(err);
		} finally {
			setDeleting(false);
		}
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
			<ConfirmDialog
				open={deleteTarget !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteTarget(null);
				}}
				title={
					deleteTarget?.type === "treino"
						? `Excluir treino "${deleteTarget.name}"?`
						: "Excluir exercício?"
				}
				description={
					deleteTarget?.type === "treino"
						? "Essa ação também removerá todos os exercícios associados e não pode ser desfeita."
						: "Essa ação não pode ser desfeita."
				}
				onConfirm={handleConfirmDelete}
			/>

			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-[#0f1a0f]">
						Planos de Treino
					</h1>
					<p className="text-sm text-[#6a7a6a]">
						Gerencie seus treinos e exercícios
					</p>
				</div>
				<CreateTreinoDialog onCreated={loadData} />
			</div>

			{treinos.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 shadow-sm">
					<Dumbbell className="size-12 text-[#4a5a4a]/30" />
					<p className="mt-4 text-[#4a5a4a]">Nenhum treino cadastrado</p>
					<p className="text-sm text-[#8a9a8a]">
						Clique em "Novo Treino" para começar
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					{treinos.map((treino, _) => {
						const isExpanded = expanded.has(treino.nome);
						const treinoExercicios = exercicios.filter(
							(ex) => ex.treino === treino.nome,
						);
						return (
							<div
								key={treino.nome + String(_)}
								className="rounded-2xl border bg-white shadow-sm"
							>
								{/** biome-ignore lint/a11y/noStaticElementInteractions: <explanation> */}
								{/** biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
								<div
									onClick={() =>
										setExpanded((prev) => {
											const next = new Set(prev);
											if (next.has(treino.nome)) next.delete(treino.nome);
											else next.add(treino.nome);
											return next;
										})
									}
									className="flex w-full cursor-pointer items-center justify-between p-5 text-left transition-colors hover:bg-[#f8faf8]/50"
								>
									<div className="flex items-center gap-3">
										<div className="flex size-10 items-center justify-center rounded-xl bg-green-50">
											<Dumbbell className="size-5 text-green-600" />
										</div>
										<div>
											<h3 className="font-semibold text-[#0f1a0f]">
												{treino.nome}
											</h3>
											<div className="flex items-center gap-2 text-sm text-[#6a7a6a]">
												{treino.tipo && <span>{treino.tipo}</span>}
												{treino.data && (
													<>
														{treino.tipo && (
															<span className="text-[#8a9a8a]">·</span>
														)}
														<span>{treino.data}</span>
													</>
												)}
												{treino.duracao && (
													<>
														{(treino.tipo || treino.data) && (
															<span className="text-[#8a9a8a]">·</span>
														)}
														<span>{treino.duracao}</span>
													</>
												)}
											</div>
										</div>
									</div>
									<div className="flex items-center gap-2">
										<Badge variant="secondary" className="text-xs">
											{treinoExercicios.length} exercício
											{treinoExercicios.length !== 1 ? "s" : ""}
										</Badge>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={(e) => {
												e.stopPropagation();
												setDeleteTarget({ type: "treino", name: treino.nome });
											}}
											className="text-red-500 hover:bg-red-50 hover:text-red-600"
										>
											<Trash2 className="size-4" />
										</Button>
										{isExpanded ? (
											<ChevronUp className="size-5 text-[#4a5a4a]" />
										) : (
											<ChevronDown className="size-5 text-[#4a5a4a]" />
										)}
									</div>
								</div>

								{isExpanded && (
									<div className="border-t border-[#e8f0e8] px-5 pb-5 pt-4">
										{(treino.objetivo || treino.meta) && (
											<div className="mb-4 flex flex-col gap-1 rounded-lg bg-[#f8faf8] p-3">
												{treino.objetivo && (
													<p className="text-sm">
														<span className="font-medium text-[#0f1a0f]">
															Objetivo:
														</span>{" "}
														<span className="text-[#4a5a4a]">
															{treino.objetivo}
														</span>
													</p>
												)}
												{treino.meta && (
													<p className="text-sm">
														<span className="font-medium text-[#0f1a0f]">
															Meta:
														</span>{" "}
														<span className="text-[#4a5a4a]">
															{treino.meta}
														</span>
													</p>
												)}
											</div>
										)}
										{treinoExercicios.length > 0 ? (
											<div className="flex flex-col gap-2">
												{treinoExercicios.map((ex, i) => {
													const globalIndex = exercicios.indexOf(ex);
													return (
														<div
															key={`${ex.nome}-${String(i)}`}
															className="flex items-center justify-between rounded-lg border border-[#e8f0e8] bg-white px-4 py-3"
														>
															<div className="flex flex-col">
																<span className="font-medium text-[#0f1a0f]">
																	{ex.nome}
																</span>
																<span className="text-xs text-[#8a9a8a]">
																	{[
																		ex.series && `${ex.series} séries`,
																		ex.repeticoes && `${ex.repeticoes} reps`,
																		ex.tempo && `${ex.tempo} min`,
																		ex.distancia && `${ex.distancia} km`,
																	]
																		.filter(Boolean)
																		.join(" · ")}
																</span>
															</div>
															<Button
																variant="ghost"
																size="icon-sm"
																onClick={() =>
																	setDeleteTarget({
																		type: "exercicio",
																		index: globalIndex,
																	})
																}
																className="text-red-500 hover:bg-red-50 hover:text-red-600"
															>
																<Trash2 className="size-4" />
															</Button>
														</div>
													);
												})}
											</div>
										) : (
											<p className="text-sm text-[#8a9a8a]">
												Nenhum exercício neste treino
											</p>
										)}
										<div className="mt-4">
											<AddExercicioForm
												treinoNome={treino.nome}
												onAdded={loadData}
											/>
										</div>
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
