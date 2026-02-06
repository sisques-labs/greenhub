'use client';

import { SDKAutoProvider } from "@repo/sdk/react";
import { QueryClientProvider } from "@/shared/providers/query-client-provider";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

interface ProvidersProps extends React.PropsWithChildren {
	apiUrl: string;
	locale: string;
	messages: Record<string, string>;
}

const Providers = ({ children, apiUrl, locale, messages }: ProvidersProps) => {
	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<SDKAutoProvider apiUrl={apiUrl}>
					<QueryClientProvider>{children}</QueryClientProvider>
				</SDKAutoProvider>
			</ThemeProvider>
		</NextIntlClientProvider>
	);
};

export default Providers;
