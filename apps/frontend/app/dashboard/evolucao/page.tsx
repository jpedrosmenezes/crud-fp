"use client";

import useAuth, { type Evolucao } from "@/app/login/auth-context";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoaderCircle, Plus, Trash2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";

function CreateEvolucaoDialog({ onCreated }: { onCreated: () => void }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { createEvolucao } = useAuth();
	const [form, setForm] = useState({ data: "", peso: "", altura: "", gordura: "" });

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.data) return;
		setLoading(true);
		try {
			await createEvolucao({
				data: form.data,
				peso: form.peso || null,
				altura: form.altura || null,
				gordura: form.gordura || null,
			});
			setForm({ data: "", peso: "", altura: "", gordura: "" });
			setOpen(false);
			onCreated();
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button size="sm" className="gap-1.5">
					<Plus className="size-4" />
					Nova Medição
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Nova Medição</DialogTitle>
				<DialogDescription>Registre seus dados corporais</DialogDescription>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="data">Data *</Label>
						<Input
							id="data"
							type="date"
							value={form.data}
							onChange={(e) => setForm({ ...form, data: e.target.value })}
							required
						/>
					</div>
					<div className="grid grid-cols-3 gap-3">
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="peso">Peso (kg)</Label>
							<Input
								id="peso"
								type="number"
								step="0.1"
								value={form.peso}
								onChange={(e) => setForm({ ...form, peso: e.target.value })}
								placeholder="75.5"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="altura">Altura (m)</Label>
							<Input
								id="altura"
								type="number"
								step="0.01"
								value={form.altura}
								onChange={(e) => setForm({ ...form, altura: e.target.value })}
								placeholder="1.75"
							/>
						</div>
						<div className="flex flex-col gap-1.5">
							<Label htmlFor="gordura">Gordura (%)</Label>
							<Input
								id="gordura"
								type="number"
								step="0.1"
								value={form.gordura}
								onChange={(e) => setForm({ ...form, gordura: e.target.value })}
								placeholder="18.5"
							/>
						</div>
					</div>
					<Button type="submit" disabled={loading} className="mt-2">
						{loading ? <LoaderCircle className="size-4 animate-spin" /> : "Registrar"}
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

	useEffect(() => {
		if (user) loadData();
	}, [user]);

	async function handleDelete(index: number) {
		if (!confirm("Deseja excluir esta medição?")) return;
		await deleteEvolucao(index);
		loadData();
	}

	const pesoEntries = evolucoes
		.filter((e) => e.peso)
		.map((e) => ({ data: e.data, valor: Number(e.peso) }));

	const maxPeso = pesoEntries.length > 0 ? Math.max(...pesoEntries.map((e) => e.valor)) : 1;

	if (isLoading || loading) {
		return (
			<div className="flex h-full items-center justify-center">
				<LoaderCircle className="size-10 animate-spin text-[#4a5a4a]" />
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-[#f8faf8] p-6 md:p-10">
			<div className="mb-8 flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold text-[#0f1a0f]">Evolução</h1>
					<p className="text-sm text-[#6a7a6a]">Acompanhe seu progresso corporal</p>
				</div>
				<CreateEvolucaoDialog onCreated={loadData} />
			</div>

			{pesoEntries.length > 1 && (
				<div className="mb-8 rounded-2xl border bg-white p-6 shadow-sm">
					<h3 className="mb-4 font-semibold text-[#0f1a0f]">Evolução do Peso</h3>
					<div className="flex h-48 items-end gap-2">
						{pesoEntries.map((entry, i) => {
							const height = (entry.valor / maxPeso) * 100;
							return (
								<div key={`${entry.data}-${i}`} className="flex flex-1 flex-col items-center gap-1">
									<span className="text-xs font-medium text-[#0f1a0f]">{entry.valor}kg</span>
									<div
										className="w-full min-w-6 rounded-t-lg bg-green-500 transition-all"
										style={{ height: `${Math.max(height, 5)}%` }}
									/>
									<span className="mt-1 text-[10px] text-[#8a9a8a]">
										{new Date(entry.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
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
					<p className="text-sm text-[#8a9a8a]">Clique em "Nova Medição" para começar</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{evolucoes.map((ev, i) => (
						<div
							key={`${ev.data}-${i}`}
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
								onClick={() => handleDelete(i)}
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