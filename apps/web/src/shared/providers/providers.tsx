import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@repo/shared/presentation/providers/query-client-provider";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "next-themes";
import { SDKProviderWithClerk } from "./sdk-provider-with-clerk";

interface ProvidersProps extends React.PropsWithChildren {
	apiUrl: string;
	messages: Record<string, string>;
}

const Providers = async ({ children, apiUrl, messages }: ProvidersProps) => {
	return (
		<ClerkProvider>
			<NextIntlClientProvider messages={messages}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
					<SDKProviderWithClerk apiUrl={apiUrl}>
						<QueryProvider>{children}</QueryProvider>
					</SDKProviderWithClerk>
				</ThemeProvider>
			</NextIntlClientProvider>
		</ClerkProvider>
	);
};

export default Providers;
