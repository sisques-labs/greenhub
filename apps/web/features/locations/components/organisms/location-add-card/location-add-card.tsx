"use client";

import {
	Card,
	CardContent,
} from "@repo/shared/presentation/components/ui/card";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface LocationAddCardProps {
	onClick: () => void;
}

export function LocationAddCard({ onClick }: LocationAddCardProps) {
	const t = useTranslations();

	return (
		<Card
			className="border-dashed cursor-pointer hover:bg-accent/50 transition-colors"
			onClick={onClick}
		>
			<CardContent className="flex flex-col items-center justify-center min-h-[300px] p-6">
				<PlusIcon className="h-12 w-12 text-muted-foreground mb-4" />
				<h3 className="text-lg font-semibold mb-2">
					{t("pages.locations.list.actions.create.button")}
				</h3>
				<p className="text-sm text-muted-foreground text-center">
					{t("pages.locations.list.actions.create.description")}
				</p>
			</CardContent>
		</Card>
	);
}

