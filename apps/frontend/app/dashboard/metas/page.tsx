"use client";

import useAuth, { type Meta } from "@/app/login/auth-context";
import { Badge } from "@/components/ui/badge";
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
import { LoaderCircle, Plus, Target, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";

function CreateMetaDialog({ onCreated }: { onCreated: () => void }) {
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const { createMeta } = useAuth();
	const [form, setForm] = useState({ descricao: "", prazo: "", status: "Em andamento" });

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.descricao.trim()) return;
		setLoading(true);
		try {
			await createMeta({
				descricao: form.descricao,
				prazo: form.prazo ? Number(form.prazo) : null,
				status: form.status || null,
			});
			setForm({ descricao: "", prazo: "", status: "Em andamento" });
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
					Nova Meta
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogTitle>Nova Meta</DialogTitle>
				<DialogDescription>Defina um objetivo para alcançar</DialogDescription>
				<form onSubmit={handleSubmit} className="flex flex-col gap-4">
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="descricao">Descrição *</Label>
						<Input
							id="descricao"
							value={form.descricao}
							onChange={(e) => setForm({ ...form, descricao: e.target.value })}
							placeholder="Ex: Perder 5kg"
							required
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="prazo">Prazo (dias)</Label>
						<Input
							id="prazo"
							type="number"
							value={form.prazo}
							onChange={(e) => setForm({ ...form, prazo: e.target.value })}
							placeholder="Ex: 30"
						/>
					</div>
					<div className="flex flex-col gap-1.5">
						<Label htmlFor="status">Status</Label>
						<select
							id="status"
							value={form.status}
							onChange={(e) => setForm({ ...form, status: e.target.value })}
							className="flex h-9 w-full rounded-lg border border-[#e8f0e8] bg-white px-3 text-sm text-[#0f1a0f] outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600/20"
						>
							<option value="Em andamento">Em andamento</option>
							<option value="Concluída">Concluída</option>
							<option value="Pendente">Pendente</option>
						</select>
					</div>
					<Button type="submit" disabled={loading} className="mt-2">
						{loading ? <LoaderCircle className="size-4 animate-spin" /> : "Criar Meta"}
					</Button>
				</form>
			</DialogContent>
		</Dialog>
	);
}

const statusColors: Record<string, string> = {
	"Em andamento": "bg-blue-50 text-blue-700 border-blue-200",
	Concluída: "bg-green-50 text-green-700 border-green-200",
	Pendente: "bg-amber-50 text-amber-700 border-amber-200",
};

export default function MetasPage() {
	const { user, isLoading, fetchMetas, deleteMeta } = useAuth();
	const [metas, setMetas] = useState<Meta[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<string>("Todas");

	async function loadData() {
		try {
			const data = await fetchMetas();
			setMetas(data);
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
		if (!confirm("Deseja excluir esta meta?")) return;
		await deleteMeta(index);
		loadData();
	}

	const filtered = filter === "Todas" ? metas : metas.filter((m) => m.status === filter);

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
					<h1 className="text-2xl font-bold text-[#0f1a0f]">Metas</h1>
					<p className="text-sm text-[#6a7a6a]">Acompanhe seus objetivos e prazos</p>
				</div>
				<CreateMetaDialog onCreated={loadData} />
			</div>

			<div className="mb-6 flex gap-2">
				{["Todas", "Em andamento", "Concluída", "Pendente"].map((s) => (
					<button
						key={s}
						type="button"
						onClick={() => setFilter(s)}
						className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
							filter === s
								? "bg-green-600 text-white"
								: "bg-white text-[#4a5a4a] hover:bg-[#f0f9f0] border border-[#e8f0e8]"
						}`}
					>
						{s}
					</button>
				))}
			</div>

			{metas.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border bg-white py-16 shadow-sm">
					<Target className="size-12 text-[#4a5a4a]/30" />
					<p className="mt-4 text-[#4a5a4a]">Nenhuma meta cadastrada</p>
					<p className="text-sm text-[#8a9a8a]">Clique em "Nova Meta" para começar</p>
				</div>
			) : (
				<div className="flex flex-col gap-3">
					{filtered.map((meta, i) => {
						const realIndex = metas.indexOf(meta);
						const colorClass = statusColors[meta.status ?? "Pendente"] ?? statusColors.Pendente;
						return (
							<div
								key={`${meta.descricao}-${i}`}
								className="flex items-center justify-between rounded-2xl border bg-white p-5 shadow-sm"
							>
								<div className="flex items-center gap-4">
									<div className="flex size-10 items-center justify-center rounded-xl bg-green-50">
										<Target className="size-5 text-green-600" />
									</div>
									<div>
										<h3 className="font-semibold text-[#0f1a0f]">{meta.descricao}</h3>
										<div className="flex items-center gap-2 text-sm text-[#6a7a6a]">
											{meta.prazo && <span>Prazo: {meta.prazo} dias</span>}
										</div>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<Badge className={`${colorClass} border`}>
										{meta.status ?? "Pendente"}
									</Badge>
									<Button
										variant="ghost"
										size="icon-sm"
										onClick={() => handleDelete(realIndex)}
										className="text-red-500 hover:bg-red-50 hover:text-red-600"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}