import { useAuthRegisterForm } from '@/features/auth/hooks/use-auth-register-form/use-auth-register-form';
import { act, renderHook } from '@testing-library/react';

// Mock the auth store
jest.mock('@/features/auth/stores/auth-page-store', () => ({
	useAuthPageStore: () => ({
		email: '',
		password: '',
		confirmPassword: '',
		setEmail: jest.fn(),
		setPassword: jest.fn(),
		setConfirmPassword: jest.fn(),
	}),
}));

// Mock next-intl
jest.mock('next-intl', () => ({
	useTranslations: () => (key: string) => key,
}));

describe('useAuthRegisterForm', () => {
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
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			expect(result.current.formEmail).toBe('');
			expect(result.current.formPassword).toBe('');
			expect(result.current.formConfirmPassword).toBe('');
			expect(result.current.formErrors).toEqual({});
		});

		it('should expose setEmail, setPassword, and setConfirmPassword from store', () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			expect(result.current.setEmail).toBeDefined();
			expect(result.current.setPassword).toBeDefined();
			expect(result.current.setConfirmPassword).toBeDefined();
		});
	});

	describe('State Setters', () => {
		it('should update formEmail', () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			act(() => {
				result.current.setFormEmail('test@example.com');
			});

			expect(result.current.formEmail).toBe('test@example.com');
		});

		it('should update formPassword', () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			act(() => {
				result.current.setFormPassword('password123');
			});

			expect(result.current.formPassword).toBe('password123');
		});

		it('should update formConfirmPassword', () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			act(() => {
				result.current.setFormConfirmPassword('password123');
			});

			expect(result.current.formConfirmPassword).toBe('password123');
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Set valid form data
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('password123');
				result.current.setFormConfirmPassword('password123');
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
				confirmPassword: 'password123',
			});
		});

		it('should set form errors when email is missing', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Set only passwords
			act(() => {
				result.current.setFormPassword('password123');
				result.current.setFormConfirmPassword('password123');
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
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Set invalid email
			act(() => {
				result.current.setFormEmail('invalid-email');
				result.current.setFormPassword('password123');
				result.current.setFormConfirmPassword('password123');
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
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

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
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Set password less than 8 characters
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('short');
				result.current.setFormConfirmPassword('short');
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

		it('should set form errors when confirmPassword is missing', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Set email and password but not confirmPassword
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

			expect(result.current.formErrors.confirmPassword).toBeDefined();
			expect(result.current.formErrors.confirmPassword?.message).toBeTruthy();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set form errors when passwords do not match', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Set passwords that don't match
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('password123');
				result.current.setFormConfirmPassword('password456');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.confirmPassword).toBeDefined();
			expect(result.current.formErrors.confirmPassword?.message).toBeTruthy();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should set multiple form errors when multiple fields are invalid', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Submit empty form
			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors.email).toBeDefined();
			expect(result.current.formErrors.password).toBeDefined();
			expect(result.current.formErrors.confirmPassword).toBeDefined();
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should clear form errors on successful validation', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

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
				result.current.setFormConfirmPassword('password123');
			});

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
		});

		it('should prevent default form submission', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

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
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// If hook renders successfully, schema was created
			expect(result.current).toBeDefined();
		});
	});

	describe('Error Mapping', () => {
		it('should map Zod errors to field-specific errors correctly', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// Check that errors are mapped to the correct fields
			expect(result.current.formErrors).toHaveProperty('email');
			expect(result.current.formErrors).toHaveProperty('password');
			expect(result.current.formErrors).toHaveProperty('confirmPassword');
			expect(result.current.formErrors.email).toHaveProperty('message');
			expect(result.current.formErrors.password).toHaveProperty('message');
			expect(result.current.formErrors.confirmPassword).toHaveProperty('message');
		});

		it('should only set errors for fields that failed validation', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			// Set valid email and matching passwords but too short
			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('short');
				result.current.setFormConfirmPassword('short');
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

	describe('Password Confirmation Logic', () => {
		it('should allow submission when passwords match', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('password123');
				result.current.setFormConfirmPassword('password123');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalled();
			expect(result.current.formErrors).toEqual({});
		});

		it('should reject submission when passwords do not match', async () => {
			const { result } = renderHook(() => useAuthRegisterForm(defaultProps));

			act(() => {
				result.current.setFormEmail('test@example.com');
				result.current.setFormPassword('password123');
				result.current.setFormConfirmPassword('differentpassword');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).not.toHaveBeenCalled();
			expect(result.current.formErrors.confirmPassword).toBeDefined();
		});
	});
});
