import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./shared/i18n/request.ts');

const nextConfig: NextConfig = {
	/* config options here */
	transpilePackages: ['@repo/shared'],
	output: 'standalone',
};

export default withNextIntl(nextConfig);
