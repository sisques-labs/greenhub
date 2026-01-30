"use client";

import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/ui/primitives/form";
import { Input } from "@/ui/primitives/input";
import { useTranslations } from "next-intl";

interface AuthEmailFieldProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	error?: { message?: string };
	onEmailChange?: (value: string) => void;
}

export function AuthEmailField({
	value,
	onChange,
	disabled = false,
	error,
	onEmailChange,
}: AuthEmailFieldProps) {
	const t = useTranslations();

	return (
		<FormItem>
			<FormLabel>{t("pages.auth.fields.email.label")}</FormLabel>
			<FormControl>
				<Input
					type="email"
					placeholder={t("pages.auth.fields.email.placeholder")}
					disabled={disabled}
					value={value}
					onChange={(e) => {
						onChange(e.target.value);
						onEmailChange?.(e.target.value);
					}}
				/>
			</FormControl>
			{error && <FormMessage>{error.message}</FormMessage>}
		</FormItem>
	);
}
