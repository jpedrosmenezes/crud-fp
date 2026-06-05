"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, ChevronLeft, Dumbbell, LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const features = [
	"Planos de treino personalizados",
	"Acompanhamento de evolução",
	"Metas e objetivos claros",
	"Sugestões inteligentes",
];

const userSchema = z.object({
	nome: z
		.string()
		.min(3, "O nome precisa ter no mínimo 5 caracteres.")
		.max(32, "O nome pode ter no máximo 32 caracteres."),
});

export default function LoginPage() {
	const [loginIsLoading, setLoginFunction] = useTransition();
	const form = useForm<z.infer<typeof userSchema>>({
		resolver: zodResolver(userSchema),
		defaultValues: {
			nome: "",
		},
	});
	const router = useRouter();
	async function onSubmit(data: z.infer<typeof userSchema>) {
		setLoginFunction(async () => {
			const login = await fetch("http://localhost:8000/login", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			const json = await login.json();
			if (login.ok) {
				localStorage.setItem("auth_info", JSON.stringify({ name: data.nome }));
				router.push("/dashboard");
			} else {
				console.error(json);
			}
		});
	}
	return (
		<div className="flex min-h-screen">
			<div className="relative hidden w-[45%] flex-col items-center justify-center gap-6 bg-linear-to-br from-primary to-green-800 p-16 text-white lg:flex">
				<div className="absolute -top-16 -left-16 size-72 rounded-full bg-white/10" />
				<div className="absolute bottom-32 right-4 size-56 rounded-full bg-white/5" />
				<div className="relative z-10 flex flex-col items-center gap-6">
					<div className="flex flex-col items-center gap-4">
						<Dumbbell className="size-14" strokeWidth={2.5} />
						<h1 className="text-4xl font-bold tracking-tight">FitPlanner</h1>
					</div>
					<p className="max-w-105 text-balance text-center text-lg leading-relaxed text-white/90">
						Organize sua rotina fitness de forma prática
					</p>
					<div className="mt-4 flex flex-col gap-3">
						{features.map((feature) => (
							<div key={feature} className="flex items-center gap-3">
								<div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/20">
									<Check className="size-3.5" />
								</div>
								<span className="text-base">{feature}</span>
							</div>
						))}
					</div>
				</div>
			</div>

			<div className="flex flex-1 items-center justify-center p-10 lg:p-16">
				<div className="w-full max-w-105 rounded-2xl border bg-card p-12 shadow-2xl shadow-black/5">
					<div className="flex flex-col gap-6">
						<Link
							href="/"
							className="-ml-2 inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
						>
							<ChevronLeft className="size-5" />
							Voltar
						</Link>
						<div>
							<h2 className="text-[26px] font-extrabold tracking-tight text-foreground">
								Bem-vindo ao FitPlanner
							</h2>
							<p className="mt-1 text-base leading-relaxed text-muted-foreground">
								Digite seu nome para começar sua jornada fitness
							</p>
						</div>
						<form
							id="form-rhf-demo"
							className="space-y-4"
							onSubmit={form.handleSubmit(onSubmit)}
						>
							<div className="flex flex-col gap-2">
								<Controller
									name="nome"
									control={form.control}
									render={({ field, fieldState }) => (
										<>
											<Label
												htmlFor="name"
												className="text-sm font-medium text-foreground"
											>
												Seu nome
											</Label>
											<Input
												placeholder="Ex: Ricardo"
												className="h-12 rounded-[10px] border-border bg-[#f8faf8] text-base"
												{...field}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</>
									)}
								/>
							</div>

							<Button
								className="h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-lg shadow-primary/30"
								type="submit"
								disabled={loginIsLoading}
							>
								{loginIsLoading ? (
									<LoaderCircleIcon className="animate-spin" />
								) : (
									"Começar Minha Jornada"
								)}
							</Button>

							<p className="text-center text-xs text-muted-foreground">
								Seus dados ficam salvos apenas no seu dispositivo
							</p>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
