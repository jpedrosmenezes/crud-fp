"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, Plus, Trash2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import useAuth, { type Evolucao } from "@/app/login/auth-context";
import { ConfirmDialog } from "@/components/confirm-dialog";
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

const evolucaoSchema = z.object({
	data: z.string().min(1, "A data é obrigatória."),
	peso: z.string(),
	altura: z.string(),
	gordura: z.string(),
});

type EvolucaoFormData = z.infer<typeof evolucaoSchema>;

function CreateEvolucaoDialog({ onCreated }: { onCreated: () => void }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { createEvolucao } = useAuth();
	const { control, handleSubmit, reset } = useForm<EvolucaoFormData>({
		resolver: zodResolver(evolucaoSchema as any),
		defaultValues: {
			data: "",
			peso: "",
			altura: "",
			gordura: "",
		},
	});

	async function onSubmit(data: EvolucaoFormData) {
		setLoading(true);
		try {
			await createEvolucao({
				data: data.data,
				peso: data.peso || null,
				altura: data.altura || null,
				gordura: data.gordura || null,
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
					Nova Medição
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Nova Medição</DialogTitle>
				<DialogDescription>Registre seus dados corporais</DialogDescription>
				<form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Controller
							name="data"
							control={control}
							render={({ field, fieldState }) => (
								<>
									<Label htmlFor="data">Data *</Label>
									<Input id="data" type="date" {...field} />
									{fieldState.invalid && (
										<FieldError errors={[fieldState.error]} />
									)}
								</>
							)}
						/>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col gap-1.5">
							<Controller
								name="peso"
								control={control}
								render={({ field }) => (
									<>
										<Label htmlFor="peso">Peso (kg)</Label>
										<Input
											id="peso"
											type="number"
											step="0.1"
											placeholder="75.5"
											{...field}
										/>
									</>
								)}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Controller
								name="altura"
								control={control}
								render={({ field }) => (
									<>
										<Label htmlFor="altura">Altura (m)</Label>
										<Input
											id="altura"
											type="number"
											step="0.01"
											placeholder="1.75"
											{...field}
										/>
									</>
								)}
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Controller
								name="gordura"
								control={control}
								render={({ field }) => (
									<>
										<Label htmlFor="gordura">Gordura (%)</Label>
										<Input
											id="gordura"
											type="number"
											step="0.1"
											placeholder="18.5"
											{...field}
										/>
									</>
								)}
							/>
						</div>
					</div>
					<Button type="submit" disabled={loading} className="mt-2 gap-1.5">
						{loading && <LoaderCircle className="size-4 animate-spin" />}
						{loading ? "Registrando..." : "Registrar"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export default function EvolucaoPage() {
	const { user, isLoading, fetchEvolucoes, deleteEvolucao } = useAuth();
	const [evolucoes, setEvolucoes] = useState<Evolucao[]>([]);
	const [loading, setLoading] = useState(true);
	const [deleteIndex, setDeleteIndex] = useState<number | null>(null);

	async function loadData() {
		try {
			const data = await fetchEvolucoes();
			setEvolucoes(data);
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
		if (deleteIndex === null) return;
		await deleteEvolucao(deleteIndex);
		setDeleteIndex(null);
		await loadData();
	}

	const pesoEntries = evolucoes
		.filter((e) => e.peso)
		.map((e) => ({ data: e.data, valor: Number(e.peso) }));

	const maxPeso =
		pesoEntries.length > 0 ? Math.max(...pesoEntries.map((e) => e.valor)) : 1;

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
				open={deleteIndex !== null}
				onOpenChange={(open) => {
					if (!open) setDeleteIndex(null);
				}}
				title="Excluir medição?"
				description="Essa ação não pode ser desfeita."
				onConfirm={handleConfirmDelete}
			/>

			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-[#0f1a0f]">Evolução</h1>
					<p className="text-sm text-[#6a7a6a]">
						Acompanhe seu progresso corporal
					</p>
				</div>
				<CreateEvolucaoDialog onCreated={loadData} />
			</div>

			{pesoEntries.length > 1 && (
				<div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
					<h3 className="mb-4 font-semibold text-[#0f1a0f]">
						Evolução do Peso
					</h3>
					<div className="flex h-48 items-end gap-2">
						{pesoEntries.map((entry, i) => {
							const height = (entry.valor / maxPeso) * 100;
							return (
								<div
									key={`${entry.data}-${String(i)}`}
									className="flex flex-1 flex-col items-center gap-1"
								>
									<span className="text-xs font-medium text-[#0f1a0f]">
										{entry.valor}kg
									</span>
									<div
										className="w-full min-w-6 rounded-t-lg bg-green-500 transition-all"
										style={{ height: `${Math.max(height, 5)}%` }}
									/>
									<span className="mt-1 text-[10px] text-[#8a9a8a]">
										{new Date(entry.data).toLocaleDateString("pt-BR", {
											day: "2-digit",
											month: "2-digit",
										})}
									</span>
								</div>
							);
						})}
					</div>
				</div>
			)}

			{evolucoes.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 shadow-sm">
					<TrendingUp className="size-12 text-[#4a5a4a]/30" />
					<p className="mt-4 text-[#4a5a4a]">Nenhuma medição registrada</p>
					<p className="text-sm text-[#8a9a8a]">
						Clique em "Nova Medição" para começar
					</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{evolucoes.map((ev, i) => (
						<div
							key={`${ev.data}-${String(i)}`}
							className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm"
						>
							<div className="flex items-center gap-4">
								<div className="flex size-10 items-center justify-center rounded-xl bg-green-50">
									<TrendingUp className="size-5 text-green-600" />
								</div>
								<div>
									<h3 className="font-semibold text-[#0f1a0f]">
										{new Date(ev.data).toLocaleDateString("pt-BR")}
									</h3>
									<div className="flex gap-3 text-sm text-[#6a7a6a]">
										{ev.peso && <span>{ev.peso} kg</span>}
										{ev.altura && <span>{ev.altura} m</span>}
										{ev.gordura && <span>{ev.gordura}% gordura</span>}
									</div>
								</div>
							</div>
							<Button
								variant="ghost"
								size="icon-sm"
								onClick={() => setDeleteIndex(i)}
								className="text-red-500 hover:bg-red-50 hover:text-red-600"
							>
								<Trash2 className="size-4" />
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
