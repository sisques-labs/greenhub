"use client";

import { Button } from "@repo/shared/presentation/components/ui/button";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "@repo/shared/presentation/components/ui/card";
import { Checkbox } from "@repo/shared/presentation/components/ui/checkbox";
import { PlusIcon } from "lucide-react";
import { useTranslations } from "next-intl";

interface Task {
	id: string;
	title: string;
	assignedTo?: string;
	location?: string;
	scheduledTime?: string;
	completed: boolean;
}

interface TodayTasksSectionProps {
	tasks: Task[];
	isLoading?: boolean;
}

/**
 * Today's tasks section component
 * Displays tasks scheduled for today
 */
export function TodayTasksSection({
	tasks,
	isLoading = false,
}: TodayTasksSectionProps) {
	const t = useTranslations("dashboard.todayTasks");

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<div className="h-6 w-32 bg-muted rounded animate-pulse" />
						<div className="h-8 w-8 bg-muted rounded animate-pulse" />
					</CardTitle>
				</CardHeader>
				<CardContent className="space-y-3">
					{[1, 2, 3].map((i) => (
						<div key={i} className="h-16 bg-muted rounded-lg animate-pulse" />
					))}
				</CardContent>
			</Card>
		);
	}

	if (tasks.length === 0) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between">
						<span>{t("title")}</span>
						<Button variant="ghost" size="icon">
							<PlusIcon className="h-4 w-4" />
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-center py-8">{t("empty")}</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>{t("title")}</span>
					<Button variant="ghost" size="icon">
						<PlusIcon className="h-4 w-4" />
					</Button>
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-3">
				{tasks.map((task) => (
					<div
						key={task.id}
						className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
					>
						<Checkbox checked={task.completed} className="mt-1" disabled />
						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								<span
									className={`font-medium ${
										task.completed ? "line-through text-muted-foreground" : ""
									}`}
								>
									{task.title}
								</span>
								{task.completed && (
									<span className="text-xs text-green-600 font-medium">
										{t("completed")}
									</span>
								)}
							</div>
							<div className="text-sm text-muted-foreground space-y-0.5">
								{task.assignedTo && (
									<div>
										{t("assignedTo")}: {task.assignedTo}
									</div>
								)}
								{task.location && <div>{task.location}</div>}
								{task.scheduledTime && <div>{task.scheduledTime}</div>}
							</div>
						</div>
					</div>
				))}
				<div className="pt-2">
					<Button variant="link" className="w-full text-green-600">
						{t("seeAll")}
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
