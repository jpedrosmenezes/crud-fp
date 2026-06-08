"use client";

import * as React from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LoaderCircle, Trash2 } from "lucide-react";

interface ConfirmDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	title: string;
	description: string;
	onConfirm: () => Promise<void>;
}

export function ConfirmDialog({
	open,
	onOpenChange,
	title,
	description,
	onConfirm,
}: ConfirmDialogProps) {
	const [loading, setLoading] = React.useState(false);

	async function handleConfirm() {
		setLoading(true);
		try {
			await onConfirm();
			onOpenChange(false);
		} catch (err) {
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogTitle>{title}</DialogTitle>
				<DialogDescription>{description}</DialogDescription>
				<div className="flex justify-end gap-2 pt-2">
					<Button
						variant="outline"
						onClick={() => onOpenChange(false)}
						disabled={loading}
					>
						Cancelar
					</Button>
					<Button
						variant="destructive"
						onClick={handleConfirm}
						disabled={loading}
						className="gap-1.5"
					>
						{loading ? (
							<LoaderCircle className="size-4 animate-spin" />
						) : (
							<Trash2 className="size-4" />
						)}
						{loading ? "Excluindo..." : "Excluir"}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}