"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cache } from "react";
export const getQueryClient = cache(() => new QueryClient());

export default function QueryProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<QueryClientProvider client={getQueryClient()}>
			{children}
		</QueryClientProvider>
	);
}
