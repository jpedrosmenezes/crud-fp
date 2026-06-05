"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { type Evolucao, type Exercicio, type Meta, type Treino, api } from "@/lib/api";

export type { Treino, Exercicio, Meta, Evolucao };

export interface User {
	nome: string;
}

interface AuthContextValue {
	user: User | null;
	isLoading: boolean;
	fetchTreinos: () => Promise<Treino[]>;
	createTreino: (data: Partial<Treino>) => Promise<void>;
	updateTreino: (nome: string, data: Partial<Treino>) => Promise<void>;
	deleteTreino: (nome: string) => Promise<void>;
	fetchExercicios: (treino?: string) => Promise<Exercicio[]>;
	createExercicio: (data: Partial<Exercicio>) => Promise<void>;
	updateExercicio: (index: number, data: Partial<Exercicio>) => Promise<void>;
	deleteExercicio: (index: number) => Promise<void>;
	fetchMetas: () => Promise<Meta[]>;
	createMeta: (data: Partial<Meta>) => Promise<void>;
	updateMeta: (index: number, data: Partial<Meta>) => Promise<void>;
	deleteMeta: (index: number) => Promise<void>;
	fetchEvolucoes: () => Promise<Evolucao[]>;
	createEvolucao: (data: Partial<Evolucao>) => Promise<void>;
	updateEvolucao: (index: number, data: Partial<Evolucao>) => Promise<void>;
	deleteEvolucao: (index: number) => Promise<void>;
	fetchSugestoes: (objetivo?: string) => Promise<void>;
	sugestoes: Treino[];
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();

	function requireUser(): string {
		if (!user) throw new Error("Usuário não autenticado");
		return user.nome;
	}

	async function fetchTreinos(): Promise<Treino[]> {
		return api.getTreinos(requireUser());
	}

	async function createTreino(data: Partial<Treino>): Promise<void> {
		await api.createTreino(requireUser(), data);
	}

	async function updateTreino(nome: string, data: Partial<Treino>): Promise<void> {
		await api.updateTreino(requireUser(), nome, data);
	}

	async function deleteTreino(nome: string): Promise<void> {
		await api.deleteTreino(requireUser(), nome);
	}

	async function fetchExercicios(treino?: string): Promise<Exercicio[]> {
		return api.getExercicios(requireUser(), treino);
	}

	async function createExercicio(data: Partial<Exercicio>): Promise<void> {
		await api.createExercicio(requireUser(), data);
	}

	async function updateExercicio(index: number, data: Partial<Exercicio>): Promise<void> {
		await api.updateExercicio(requireUser(), index, data);
	}

	async function deleteExercicio(index: number): Promise<void> {
		await api.deleteExercicio(requireUser(), index);
	}

	async function fetchMetas(): Promise<Meta[]> {
		return api.getMetas(requireUser());
	}

	async function createMeta(data: Partial<Meta>): Promise<void> {
		await api.createMeta(requireUser(), data);
	}

	async function updateMeta(index: number, data: Partial<Meta>): Promise<void> {
		await api.updateMeta(requireUser(), index, data);
	}

	async function deleteMeta(index: number): Promise<void> {
		await api.deleteMeta(requireUser(), index);
	}

	async function fetchEvolucoes(): Promise<Evolucao[]> {
		return api.getEvolucoes(requireUser());
	}

	async function createEvolucao(data: Partial<Evolucao>): Promise<void> {
		await api.createEvolucao(requireUser(), data);
	}

	async function updateEvolucao(index: number, data: Partial<Evolucao>): Promise<void> {
		await api.updateEvolucao(requireUser(), index, data);
	}

	async function deleteEvolucao(index: number): Promise<void> {
		await api.deleteEvolucao(requireUser(), index);
	}

	const [sugestoes, setSugestoes] = useState<Treino[]>([]);

	async function fetchSugestoes(objetivo?: string): Promise<void> {
		const res = await api.getSugestoes(requireUser(), objetivo);
		setSugestoes(res.dados ?? []);
	}

	useEffect(() => {
		const stored = localStorage.getItem("auth_info");
		if (!stored) {
			router.replace("/login");
		} else {
			setUser({ nome: JSON.parse(stored).name });
		}
		setIsLoading(false);
	}, [router.replace]);

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				fetchTreinos,
				createTreino,
				updateTreino,
				deleteTreino,
				fetchExercicios,
				createExercicio,
				updateExercicio,
				deleteExercicio,
				fetchMetas,
				createMeta,
				updateMeta,
				deleteMeta,
				fetchEvolucoes,
				createEvolucao,
				updateEvolucao,
				deleteEvolucao,
				fetchSugestoes,
				sugestoes,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export default function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}