"use client";

import { Input } from "@repo/shared/presentation/components/ui/input";
import { SearchIcon } from "lucide-react";
import type { ChangeEvent } from "react";

interface SearchBarProps {
	placeholder: string;
	value: string;
	onChange: (value: string) => void;
	className?: string;
}

/**
 * Reusable search bar component with search icon
 */
export function SearchBar({
	placeholder,
	value,
	onChange,
	className,
}: SearchBarProps) {
	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		onChange(e.target.value);
	};

	return (
		<div className={`relative ${className || ""}`}>
			<SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				type="text"
				placeholder={placeholder}
				value={value}
				onChange={handleChange}
				className="pl-10"
			/>
		</div>
	);
}
