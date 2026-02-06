'use client';

import { NextIntlClientProvider } from 'next-intl';
import { ThemeProvider } from 'next-themes';
import { QueryClientProvider } from 'shared/providers/query-client-provider';

interface ProvidersProps extends React.PropsWithChildren {
	locale: string;
	messages: Record<string, string>;
}

const Providers = ({ children, locale, messages }: ProvidersProps) => {
	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<QueryClientProvider>{children}</QueryClientProvider>
			</ThemeProvider>
		</NextIntlClientProvider>
	);
};

export default Providers;
