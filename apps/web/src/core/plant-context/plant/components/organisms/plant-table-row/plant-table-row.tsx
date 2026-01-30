"use client";

import type { PlantResponse } from "@repo/sdk";
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/ui/primitives/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/ui/primitives/dropdown-menu";
import {
	TableCell,
	TableRow,
} from "@/ui/primitives/table";
import { MapPinIcon, MoreVerticalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { getPlantStatusBadge } from "@/core/plant-context/plant/utils/plant-status.utils";

interface PlantTableRowProps {
	plant: PlantResponse;
	growingUnitName?: string;
	onEdit?: (plant: PlantResponse) => void;
	onDelete?: (id: string) => void;
}

export function PlantTableRow({
	plant,
	growingUnitName,
	onEdit,
	onDelete,
}: PlantTableRowProps) {
	const t = useTranslations();
	const locale = useLocale();
	const router = useRouter();

	const formatDate = (date?: Date | null): string => {
		if (!date) return "-";
		const now = new Date();
		const plantDate = new Date(date);
		const diffTime = Math.abs(now.getTime() - plantDate.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return t("pages.plants.list.table.lastWatering.today");
		if (diffDays === 1)
			return t("pages.plants.list.table.lastWatering.yesterday");
		if (diffDays < 7)
			return t("pages.plants.list.table.lastWatering.daysAgo", {
				days: diffDays,
			});
		if (diffDays < 14)
			return t("pages.plants.list.table.lastWatering.weeksAgo", {
				weeks: Math.floor(diffDays / 7),
			});
		return plantDate.toLocaleDateString();
	};

	const getLocationIcon = () => {
		return <MapPinIcon className="h-4 w-4 text-muted-foreground" />;
	};

	const initials = (plant.name || plant.species || "P")
		.split(" ")
		.map((n) => n[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	const handleRowClick = () => {
		router.push(`/${locale}/plants/${plant.id}`);
	};

	const handleActionClick = (e: React.MouseEvent) => {
		e.stopPropagation();
	};

	return (
		<TableRow
			className="cursor-pointer hover:bg-muted/50 transition-colors"
			onClick={handleRowClick}
		>
			<TableCell>
				<Avatar className="h-10 w-10">
					<AvatarImage src={undefined} alt={plant.name || plant.species} />
					<AvatarFallback>{initials}</AvatarFallback>
				</Avatar>
			</TableCell>
			<TableCell>
				<div>
					<div className="font-medium">
						{plant.name || t("pages.plants.detail.unnamed")}
					</div>
					<div className="text-sm text-muted-foreground">
						{plant.species || "-"}
					</div>
				</div>
			</TableCell>
			<TableCell>
				{plant.location ? (
					<div className="flex items-center gap-2">
						{getLocationIcon()}
						<span className="text-sm">{plant.location.name}</span>
					</div>
				) : (
				<div className="flex items-center gap-2">
					{getLocationIcon()}
						<span className="text-sm text-muted-foreground">
							{t("common.unknown")}
					</span>
				</div>
				)}
			</TableCell>
			<TableCell>{getPlantStatusBadge(plant.status, t)}</TableCell>
			<TableCell>
				<span className="text-sm text-muted-foreground">
					{formatDate(plant.updatedAt)}
				</span>
			</TableCell>
			<TableCell onClick={handleActionClick}>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<button className="h-8 w-8 inline-flex items-center justify-center rounded-md hover:bg-accent">
							<MoreVerticalIcon className="h-4 w-4" />
						</button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem
							onClick={() => router.push(`/${locale}/plants/${plant.id}`)}
						>
							{t("pages.plants.list.actions.view")}
						</DropdownMenuItem>
						{onEdit && (
							<DropdownMenuItem onClick={() => onEdit(plant)}>
								{t("pages.plants.list.actions.edit")}
							</DropdownMenuItem>
						)}
						{onDelete && (
							<DropdownMenuItem
								onClick={() => onDelete(plant.id)}
								className="text-destructive"
							>
								{t("pages.plants.list.actions.delete")}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</TableCell>
		</TableRow>
	);
}
