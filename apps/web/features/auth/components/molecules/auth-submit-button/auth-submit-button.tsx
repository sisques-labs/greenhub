'use client';

import { Button } from '@/shared/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface AuthSubmitButtonProps {
	isLoading: boolean;
	disabled?: boolean;
	mode: 'login' | 'signup';
}

export function AuthSubmitButton({
	isLoading,
	disabled = false,
	mode,
}: AuthSubmitButtonProps) {
	const t = useTranslations();

	return (
		<Button type="submit" className="w-full" disabled={disabled || isLoading}>
			{isLoading ? (
				<>
					<Loader2 className="mr-2 h-4 w-4 animate-spin" />
					{t(`features.auth.actions.loading.${mode}`)}
				</>
			) : (
				t(`features.auth.actions.${mode}`)
			)}
		</Button>
	);
}
