const API_URL = "http://localhost:8000";

export interface User {
	nome: string;
}

export interface Treino {
	nome: string;
	tipo: string | null;
	data: string | null;
	duracao: string | null;
	objetivo: string | null;
	meta: string | null;
}

export interface Exercicio {
	nome: string;
	treino: string | null;
	modo: string | null;
	series: string | null;
	repeticoes: string | null;
	tempo: string | null;
	distancia: string | null;
}

export interface Meta {
	descricao: string;
	prazo: number | null;
	status: string | null;
}

export interface Evolucao {
	data: string;
	peso: string | null;
	altura: string | null;
	gordura: string | null;
}

export interface SugestaoResponse {
	origem: string;
	dados: Treino[];
}

export interface AgenteResponse {
	resposta: string;
}

function stripNulls(obj: Record<string, unknown>): Record<string, unknown> {
	const out: Record<string, unknown> = {};
	for (const [key, value] of Object.entries(obj)) {
		if (value === null || value === undefined) {
			out[key] = "";
		} else {
			out[key] = value;
		}
	}
	return out;
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
	const body = options?.body as string | undefined;
	const processedBody = body
		? JSON.stringify(stripNulls(JSON.parse(body)))
		: undefined;
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		body: processedBody,
		headers: {
			"Content-Type": "application/json",
			...options?.headers,
		},
	});
	if (!res.ok) {
		throw new Error(`API error: ${res.status} ${res.statusText}`);
	}
	return res.json();
}

export const api = {
	login: (nome: string) =>
		apiFetch<{ ok: boolean; criado: boolean; usuario: string }>("/login", {
			method: "POST",
			body: JSON.stringify({ nome }),
		}),

	getTreinos: (usuario: string) => apiFetch<Treino[]>(`/treinos/${usuario}`),

	createTreino: (usuario: string, data: Partial<Treino>) =>
		apiFetch<{ ok: boolean }>(`/treinos/${usuario}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	updateTreino: (usuario: string, nome: string, data: Partial<Treino>) =>
		apiFetch<{ ok: boolean }>(
			`/treinos/${usuario}/${encodeURIComponent(nome)}`,
			{
				method: "PUT",
				body: JSON.stringify(data),
			},
		),

	deleteTreino: (usuario: string, nome: string) =>
		apiFetch<{ ok: boolean }>(
			`/treinos/${usuario}/${encodeURIComponent(nome)}`,
			{
				method: "DELETE",
			},
		),

	getExercicios: (usuario: string, treino?: string) => {
		const params = treino ? `?treino=${encodeURIComponent(treino)}` : "";
		return apiFetch<Exercicio[]>(`/exercicios/${usuario}${params}`);
	},

	createExercicio: (usuario: string, data: Partial<Exercicio>) =>
		apiFetch<{ ok: boolean }>(`/exercicios/${usuario}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	updateExercicio: (usuario: string, index: number, data: Partial<Exercicio>) =>
		apiFetch<{ ok: boolean }>(`/exercicios/${usuario}/${index}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	deleteExercicio: (usuario: string, index: number) =>
		apiFetch<{ ok: boolean }>(`/exercicios/${usuario}/${index}`, {
			method: "DELETE",
		}),

	getMetas: (usuario: string) => apiFetch<Meta[]>(`/metas/${usuario}`),

	createMeta: (usuario: string, data: Partial<Meta>) =>
		apiFetch<{ ok: boolean }>(`/metas/${usuario}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	updateMeta: (usuario: string, index: number, data: Partial<Meta>) =>
		apiFetch<{ ok: boolean }>(`/metas/${usuario}/${index}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	deleteMeta: (usuario: string, index: number) =>
		apiFetch<{ ok: boolean }>(`/metas/${usuario}/${index}`, {
			method: "DELETE",
		}),

	getEvolucoes: (usuario: string) =>
		apiFetch<Evolucao[]>(`/evolucoes/${usuario}`),

	createEvolucao: (usuario: string, data: Partial<Evolucao>) =>
		apiFetch<{ ok: boolean }>(`/evolucoes/${usuario}`, {
			method: "POST",
			body: JSON.stringify(data),
		}),

	updateEvolucao: (usuario: string, index: number, data: Partial<Evolucao>) =>
		apiFetch<{ ok: boolean }>(`/evolucoes/${usuario}/${index}`, {
			method: "PUT",
			body: JSON.stringify(data),
		}),

	deleteEvolucao: (usuario: string, index: number) =>
		apiFetch<{ ok: boolean }>(`/evolucoes/${usuario}/${index}`, {
			method: "DELETE",
		}),

	getSugestoes: (usuario: string, objetivo?: string) => {
		const params = objetivo ? `?objetivo=${encodeURIComponent(objetivo)}` : "";
		return apiFetch<SugestaoResponse>(`/sugestoes/${usuario}${params}`);
	},

	postAgente: (usuario: string, pergunta: string) =>
		apiFetch<AgenteResponse>(`/agente/${usuario}`, {
			method: "POST",
			body: JSON.stringify({ pergunta }),
		}),
};
