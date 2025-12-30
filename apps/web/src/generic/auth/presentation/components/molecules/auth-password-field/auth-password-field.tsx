'use client';

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@repo/shared/presentation/components/ui/form';
import { Input } from '@repo/shared/presentation/components/ui/input';
import { useTranslations } from 'next-intl';
import type { Control, FieldPath, FieldValues } from 'react-hook-form';

interface AuthPasswordFieldProps<T extends FieldValues> {
	control: Control<T>;
	name: FieldPath<T>;
	disabled?: boolean;
	placeholder?: 'login' | 'signup';
	onPasswordChange?: (value: string) => void;
}

export function AuthPasswordField<T extends FieldValues>({
	control,
	name,
	disabled = false,
	placeholder = 'login',
	onPasswordChange,
}: AuthPasswordFieldProps<T>) {
	const t = useTranslations();

	return (
		<FormField
			// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
			control={control as any}
			// biome-ignore lint/suspicious/noExplicitAny: react-hook-form FormField requires any for generic control
			name={name as any}
			render={({ field }) => (
				<FormItem>
					<FormLabel>{t('authPage.fields.password.label')}</FormLabel>
					<FormControl>
						<Input
							type="password"
							placeholder={t(
								`authPage.fields.password.placeholder.${placeholder}`,
							)}
							disabled={disabled}
							{...field}
							onChange={(e) => {
								field.onChange(e);
								onPasswordChange?.(e.target.value);
							}}
						/>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
