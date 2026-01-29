import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { notFound } from "next/navigation";
import { getMessages } from "next-intl/server";
import { AppLayoutWithSidebar } from "@/ui/composites/app-layout-with-sidebar";
import { routing } from "@/lib/i18n/routing";
import Providers from "@/lib/providers/providers";
import "../globals.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_APP_NAME || "Sisques Labs",
	description:
		process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Sisques Labs Web App",
};

export function generateStaticParams() {
	return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: Promise<{ locale: string }>;
}>) {
	const { locale } = await params;

	// Ensure that the incoming `locale` is valid
	// biome-ignore lint/suspicious/noExplicitAny: next-intl routing.locales type is readonly array and doesn't match string type
	if (!routing.locales.includes(locale as any)) {
		notFound();
	}

	// Providing all messages to the client
	// side is the easiest way to get started
	const messages = await getMessages();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers
					apiUrl={process.env.NEXT_PUBLIC_API_URL || "http://localhost:4100"}
					messages={messages}
				>
					<AppLayoutWithSidebar>{children}</AppLayoutWithSidebar>
				</Providers>
			</body>
		</html>
	);
}
