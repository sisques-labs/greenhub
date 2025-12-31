"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@repo/shared/presentation/components/ui/form";
import { Input } from "@repo/shared/presentation/components/ui/input";
import { useTranslations } from "next-intl";
import type { Control, FieldPath, FieldValues } from "react-hook-form";

interface AuthConfirmPasswordFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: FieldPath<T>;
	disabled?: boolean;
	onConfirmPasswordChange?: (value: string) => void;
}

export function AuthConfirmPasswordField<T extends FieldValues>({
	control,
	name,
	disabled = false,
	onConfirmPasswordChange,
}: AuthConfirmPasswordFieldProps<T>) {
	const t = useTranslations();

	return (
		<FormField
			// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
			control={control as any}
			// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
			name={name as any}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{t("pages.auth.fields.confirmPassword.label")}</FormLabel>
					<FormControl>
						<Input
							type="password"
							placeholder={t("pages.auth.fields.confirmPassword.placeholder")}
							disabled={disabled}
							{...field}
							onChange={(e) => {
								field.onChange(e);
								onConfirmPasswordChange?.(e.target.value);
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
