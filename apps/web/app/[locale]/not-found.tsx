import Link from 'next/link';

export default function LocaleNotFound() {
	return (
		<div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 p-8 text-center">
			<div className="flex flex-col items-center gap-3">
				<p className="text-primary text-8xl font-bold">404</p>
				<h1 className="text-2xl font-semibold">Page not found</h1>
				<p className="text-muted-foreground max-w-md text-sm">
					The page you are looking for does not exist or has been moved.
				</p>
			</div>
			<Link
				href="/"
				className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
			>
				Go home
			</Link>
		</div>
	);
}
