import type { Metadata } from "next";
import type React from "react";
import "./globals.css";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
	title: "FitPlanner - Sua jornada fitness começa aqui",
	description:
		"Planeje seus treinos, acompanhe sua evolução e alcance suas metas com recomendações inteligentes.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="pt-BR" className={cn("h-full", "antialiased")}>
			<body className="min-h-full flex flex-col">{children}</body>
		</html>
	);
}
