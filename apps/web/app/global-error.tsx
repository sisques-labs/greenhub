'use client';

import { useEffect } from 'react';
import './globals.css';

interface GlobalErrorProps {
	error: Error & { digest?: string };
	reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
	useEffect(() => {
		console.error('Global error:', error);
	}, [error]);

	return (
		<html>
			<body className="bg-background text-foreground antialiased">
				<div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
					<div className="flex flex-col items-center gap-3">
						<div className="flex size-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="32"
								height="32"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
								strokeLinecap="round"
								strokeLinejoin="round"
							>
								<circle cx="12" cy="12" r="10" />
								<line x1="12" y1="8" x2="12" y2="12" />
								<line x1="12" y1="16" x2="12.01" y2="16" />
							</svg>
						</div>
						<h1 className="text-2xl font-semibold">Something went wrong</h1>
						<p className="text-muted-foreground max-w-md text-sm">
							A critical error occurred. Please try again or contact support if
							the problem persists.
						</p>
						{error.digest && (
							<p className="text-muted-foreground font-mono text-xs">
								Error ID: {error.digest}
							</p>
						)}
					</div>
					<div className="flex flex-col gap-3 sm:flex-row">
						<button
							onClick={reset}
							className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
						>
							Try again
						</button>
						<a
							href="/"
							className="inline-flex items-center justify-center rounded-md border px-6 py-2.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
						>
							Go home
						</a>
					</div>
				</div>
			</body>
		</html>
	);
}
