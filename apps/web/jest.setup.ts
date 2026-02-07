import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
      refresh: jest.fn(),
    }
  },
  usePathname() {
    return '/'
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  useParams() {
    return {}
  },
  redirect: jest.fn(),
  notFound: jest.fn(),
}))

// Mock next-intl
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
  useLocale: () => 'en',
  useMessages: () => ({}),
  useFormatter: () => ({
    dateTime: (date: Date) => date.toISOString(),
    number: (num: number) => num.toString(),
  }),
}))

// Mock environment variables
process.env.NEXT_PUBLIC_API_URL = 'http://localhost:4100/graphql'
