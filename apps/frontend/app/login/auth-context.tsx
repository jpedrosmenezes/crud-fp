"use client";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

export interface User {
	nome: string;
}

export type Treino = {
	nome: string;
	tipo: string | null;
	data: string | null;
	duracao: string | null;
	objetivo: string | null;
	meta: string | null;
};

export type Exercicio = {
	nome: string;
	treino: string | null;
	modo: string | null;
	series: string | null;
	repeticoes: string | null;
	tempo: string | null;
	distancia: string | null;
};

export type Meta = {
	descricao: string;
	prazo: number | null;
	status: string | null;
};

export type Evolucao = {
	data: string;
	peso: number | null;
	altura: string | null;
	gordura: number | null;
};
const AuthContext = createContext<{
	user: User | null;
	isLoading: boolean;
	fetchTreinos: () => Promise<Treino[] | null>;
	createTreino: (data: Partial<Treino>) => Promise<Treino | null>;
	fetchExercicios: () => Promise<Exercicio[] | null>;
	createExercicio: (data: Partial<Exercicio>) => Promise<Exercicio | null>;
	fetchMetas: () => Promise<Meta[] | null>;
	createMeta: (data: Partial<Meta>) => Promise<Meta | null>;
	fetchEvolucao: () => Promise<Evolucao | null>;
	createEvolucao: (data: Partial<Evolucao>) => Promise<Evolucao | null>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const router = useRouter();
	async function fetchTreinos(): Promise<Treino[] | null> {
		if (!user) return null;

		const res = await fetch(`http://localhost:8000/treinos/${user.nome}`);
		if (!res.ok) throw new Error("Falha ao buscar treinos");

		return res.json();
	}
	async function fetchMetas(): Promise<Meta[] | null> {
		if (!user) return null;

		const res = await fetch(`http://localhost:8000/metas/${user.nome}`);
		if (!res.ok) throw new Error("Falha ao buscar meta");
		return res.json();
	}
	async function fetchExercicios(): Promise<Exercicio[] | null> {
		if (!user) return null;

		const res = await fetch(`http://localhost:8000/exercicios/${user.nome}`);
		if (!res.ok) throw new Error("Falha ao buscar exercícios");
		return res.json();
	}
	async function fetchEvolucao(): Promise<Evolucao | null> {
		if (!user) return null;

		const res = await fetch(`http://localhost:8000/evolucao/${user.nome}`);
		if (!res.ok) throw new Error("Falha ao buscar evolução");
		return res.json();
	}

	async function createTreino(data: Partial<Treino>): Promise<Treino | null> {
		if (user) {
			const res = await fetch(`http://localhost:8000/treinos/${user.nome}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao criar treino");
			return res.json();
		}
		return null;
	}
	async function createMeta(data: Partial<Meta>): Promise<Meta | null> {
		if (user) {
			const res = await fetch(`http://localhost:8000/metas/${user.nome}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao criar meta");
			return res.json();
		}
		return null;
	}
	async function createExercicio(
		data: Partial<Exercicio>,
	): Promise<Exercicio | null> {
		if (user) {
			const res = await fetch(`http://localhost:8000/exercicios/${user.nome}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao criar exercício");
			return res.json();
		}
		return null;
	}

	async function createEvolucao(
		data: Partial<Evolucao>,
	): Promise<Evolucao | null> {
		if (user) {
			const res = await fetch(`http://localhost:8000/evolucao/${user.nome}`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			if (!res.ok) throw new Error("Falha ao criar evolução");
			return res.json();
		}
		return null;
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
				fetchMetas,
				createMeta,
				fetchExercicios,
				fetchEvolucao,
				createEvolucao,
				createExercicio,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}

export default function useAuth() {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within a AuthContextProvider");
	}
	return context;
}
