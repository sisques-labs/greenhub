import { SDKAutoProvider } from "@repo/sdk/react";
import { QueryProvider } from "@repo/shared/presentation/providers/query-client-provider";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";

interface ProvidersProps extends React.PropsWithChildren {
	apiUrl: string;
	messages: Record<string, string>;
}

const Providers = async ({ children, apiUrl, messages }: ProvidersProps) => {
	return (
		<NextIntlClientProvider messages={messages}>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
				<SDKAutoProvider apiUrl={apiUrl}>
					<QueryProvider>{children}</QueryProvider>
				</SDKAutoProvider>
			</ThemeProvider>
		</NextIntlClientProvider>
	);
};

export default Providers;
