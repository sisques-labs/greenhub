'use client';

import {
	FormControl,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/shared/components/ui/form';
import { Input } from '@/shared/components/ui/input';
import { useTranslations } from 'next-intl';

interface AuthConfirmPasswordFieldProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	error?: { message?: string };
	onConfirmPasswordChange?: (value: string) => void;
}

export function AuthConfirmPasswordField({
	value,
	onChange,
	disabled = false,
	error,
	onConfirmPasswordChange,
}: AuthConfirmPasswordFieldProps) {
	const t = useTranslations();

	return (
		<FormItem>
			<FormLabel>{t('pages.auth.fields.confirmPassword.label')}</FormLabel>
			<FormControl>
				<Input
					type="password"
					placeholder={t('pages.auth.fields.confirmPassword.placeholder')}
					disabled={disabled}
					value={value}
					onChange={(e) => {
						onChange(e.target.value);
						onConfirmPasswordChange?.(e.target.value);
					}}
				/>
			</FormControl>
			{error && <FormMessage>{error.message}</FormMessage>}
		</FormItem>
	);
}
