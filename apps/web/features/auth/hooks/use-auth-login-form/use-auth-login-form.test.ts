import { useAuthLoginForm } from '@/features/auth/hooks/use-auth-login-form/use-auth-login-form';
import { act, renderHook } from '@testing-library/react';

// Mock the auth store
jest.mock('@/features/auth/stores/auth-page-store', () => ({
	useAuthPageStore: () => ({
		email: '',
		password: '',
		setEmail: jest.fn(),
		setPassword: jest.fn(),
	}),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

describe('useAuthLoginForm', () => {
	const mockOnSubmit = jest.fn();

	const defaultProps = {
		onSubmit: mockOnSubmit,
	};

	beforeEach(() => {
		jest.clearAllMocks();
		mockOnSubmit.mockResolvedValue(undefined);
	});

	describe('Initialization', () => {
		it('should initialize with default values from store', () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			expect(result.current.formEmail).toBe('');
			expect(result.current.formPassword).toBe('');
			expect(result.current.formErrors).toEqual({});
		});

		it('should expose setEmail and setPassword from store', () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			expect(result.current.setEmail).toBeDefined();
			expect(result.current.setPassword).toBeDefined();
		});
	});

	describe('State Setters', () => {
		it('should update formEmail', () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			act(() => {
				result.current.setFormEmail('test@example.com');
			});

			expect(result.current.formEmail).toBe('test@example.com');
		});

		it('should update formPassword', () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			act(() => {
				result.current.setFormPassword('password123');
			});

			expect(result.current.formPassword).toBe('password123');
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// Set valid form data
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('password123');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockOnSubmit).toHaveBeenCalledWith({
				email: 'test@example.com',
				password: 'password123',
			});
		});

		it('should set form errors when email is missing', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// Set only password
			act(() => {
				result.current.setFormPassword('password123');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.email).toBeDefined();
			expect(result.current.formErrors.email?.message).toBeTruthy();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set form errors when email is invalid', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// Set invalid email
			act(() => {
				result.current.setFormEmail('invalid-email');
				result.current.setFormPassword('password123');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.email).toBeDefined();
			expect(result.current.formErrors.email?.message).toBeTruthy();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set form errors when password is missing', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// Set only email
			act(() => {
				result.current.setFormEmail('test@example.com');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.password).toBeDefined();
			expect(result.current.formErrors.password?.message).toBeTruthy();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set form errors when password is too short', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// Set password less than 8 characters
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('short');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.password).toBeDefined();
			expect(result.current.formErrors.password?.message).toBeTruthy();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set multiple form errors when both fields are invalid', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// Submit empty form
			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.email).toBeDefined();
			expect(result.current.formErrors.password).toBeDefined();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should clear form errors on successful validation', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// First, submit invalid data to set errors
			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});

			// Now submit valid data
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('password123');
			});

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
		});

		it('should handle onSubmit errors gracefully', async () => {
			const mockError = new Error('Submit failed');
			mockOnSubmit.mockRejectedValue(mockError);

			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('password123');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			// Should not throw error
			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalled();
		});

		it('should prevent default form submission', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
		});
	});

	describe('Schema Creation', () => {
		it('should create schema with translations', () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// If hook renders successfully, schema was created
			expect(result.current).toBeDefined();
		});
	});

	describe('Error Mapping', () => {
		it('should map Zod errors to field-specific errors correctly', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Check that errors are mapped to the correct fields
			expect(result.current.formErrors).toHaveProperty('email');
			expect(result.current.formErrors).toHaveProperty('password');
			expect(result.current.formErrors.email).toHaveProperty('message');
			expect(result.current.formErrors.password).toHaveProperty('message');
		});

		it('should only set errors for fields that failed validation', async () => {
			const { result } = renderHook(() => useAuthLoginForm(defaultProps));

			// Set valid email but invalid password
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('short');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.email).toBeUndefined();
			expect(result.current.formErrors.password).toBeDefined();
		});
	});
});
