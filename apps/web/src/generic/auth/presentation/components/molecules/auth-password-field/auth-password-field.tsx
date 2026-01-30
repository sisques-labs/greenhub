"use client";

import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/ui/primitives/form";
import { Input } from "@/ui/primitives/input";
import { useTranslations } from "next-intl";

interface AuthPasswordFieldProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	placeholder?: "login" | "signup";
	error?: { message?: string };
	onPasswordChange?: (value: string) => void;
}

export function AuthPasswordField({
	value,
	onChange,
	disabled = false,
	placeholder = "login",
	error,
	onPasswordChange,
}: AuthPasswordFieldProps) {
	const t = useTranslations();

	return (
		<FormItem>
			<FormLabel>{t("pages.auth.fields.password.label")}</FormLabel>
			<FormControl>
				<Input
					type="password"
					placeholder={t(
						`pages.auth.fields.password.placeholder.${placeholder}`,
					)}
					disabled={disabled}
					value={value}
					onChange={(e) => {
						onChange(e.target.value);
						onPasswordChange?.(e.target.value);
					}}
				/>
			</FormControl>
			{error && <FormMessage>{error.message}</FormMessage>}
		</FormItem>
	);
}
