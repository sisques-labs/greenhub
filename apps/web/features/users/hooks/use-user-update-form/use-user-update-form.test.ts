import { renderHook, act } from '@testing-library/react';
import { useUserUpdateForm } from './use-user-update-form';
import type { UserResponse } from '@/features/users/api/types';

describe('useUserUpdateForm', () => {
	const mockOnSubmit = jest.fn();
	const mockTranslations = (key: string) => key;

	const mockUser: UserResponse = {
		userId: 'user-123',
		name: 'John',
		lastName: 'Doe',
		userName: 'johndoe',
		bio: 'Test bio',
		avatarUrl: 'https://example.com/avatar.jpg',
		email: 'john@example.com',
		role: 'USER',
		status: 'ACTIVE',
		createdAt: '2024-01-01T00:00:00Z',
		updatedAt: '2024-01-01T00:00:00Z',
	};

	const defaultProps = {
		user: mockUser,
		onSubmit: mockOnSubmit,
		isLoading: false,
		error: null,
		t: mockTranslations,
	};

	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('Initialization', () => {
		it('should initialize with user data', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			expect(result.current.id).toBe('user-123');
			expect(result.current.name).toBe('John');
			expect(result.current.lastName).toBe('Doe');
			expect(result.current.userName).toBe('johndoe');
			expect(result.current.bio).toBe('Test bio');
			expect(result.current.avatarUrl).toBe('https://example.com/avatar.jpg');
			expect(result.current.formErrors).toEqual({});
		});

		it('should handle user with null optional fields', () => {
			const userWithNulls: UserResponse = {
				...mockUser,
				name: null,
				lastName: null,
				userName: null,
				bio: null,
				avatarUrl: null,
			};

			const { result } = renderHook(() =>
				useUserUpdateForm({
					...defaultProps,
					user: userWithNulls,
				}),
			);

			expect(result.current.name).toBe('');
			expect(result.current.lastName).toBe('');
			expect(result.current.userName).toBe('');
			expect(result.current.bio).toBe('');
			expect(result.current.avatarUrl).toBe('');
		});

		it('should initialize isDirty as false', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			expect(result.current.isDirty).toBe(false);
		});
	});

	describe('Synchronization Logic', () => {
		it('should update form state when user changes', () => {
			const { result, rerender } = renderHook(
				({ user }) =>
					useUserUpdateForm({
						...defaultProps,
						user,
					}),
				{
					initialProps: { user: mockUser },
				},
			);

			// Initial state
			expect(result.current.name).toBe('John');
			expect(result.current.lastName).toBe('Doe');

			// Change the user
			const updatedUser: UserResponse = {
				...mockUser,
				userId: 'user-456',
				name: 'Jane',
				lastName: 'Smith',
			};

			rerender({ user: updatedUser });

			// State should be updated
			expect(result.current.id).toBe('user-456');
			expect(result.current.name).toBe('Jane');
			expect(result.current.lastName).toBe('Smith');
		});

		it('should reset initialValues when user changes', () => {
			const { result, rerender } = renderHook(
				({ user }) =>
					useUserUpdateForm({
						...defaultProps,
						user,
					}),
				{
					initialProps: { user: mockUser },
				},
			);

			// Modify a field
			act(() => {
				result.current.setName('Modified Name');
			});

			expect(result.current.isDirty).toBe(true);

			// Change the user
			const updatedUser: UserResponse = {
				...mockUser,
				name: 'New Name',
			};

			rerender({ user: updatedUser });

			// isDirty should be false again after user change
			expect(result.current.name).toBe('New Name');
			expect(result.current.isDirty).toBe(false);
		});

		it('should clear form errors when user changes', () => {
			const { result, rerender } = renderHook(
				({ user }) =>
					useUserUpdateForm({
						...defaultProps,
						user,
					}),
				{
					initialProps: { user: mockUser },
				},
			);

			// Submit invalid form to generate errors
			act(() => {
				result.current.setName(''); // Clear required field if it is required
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			act(() => {
				result.current.handleSubmit(mockEvent);
			});

			// Change user
			const updatedUser: UserResponse = {
				...mockUser,
				name: 'New Name',
			};

			rerender({ user: updatedUser });

			// Errors should be cleared
			expect(result.current.formErrors).toEqual({});
		});
	});

	describe('Dirty Check Logic', () => {
		it('should set isDirty to true when name changes', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			expect(result.current.isDirty).toBe(false);

			act(() => {
				result.current.setName('New Name');
			});

			expect(result.current.isDirty).toBe(true);
		});

		it('should set isDirty to true when lastName changes', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setLastName('New LastName');
			});

			expect(result.current.isDirty).toBe(true);
		});

		it('should set isDirty to true when userName changes', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setUserName('newusername');
			});

			expect(result.current.isDirty).toBe(true);
		});

		it('should set isDirty to true when bio changes', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setBio('New bio');
			});

			expect(result.current.isDirty).toBe(true);
		});

		it('should set isDirty to true when avatarUrl changes', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setAvatarUrl('https://example.com/new-avatar.jpg');
			});

			expect(result.current.isDirty).toBe(true);
		});

		it('should set isDirty to false when reverting to original value', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			// Change value
			act(() => {
				result.current.setName('New Name');
			});

			expect(result.current.isDirty).toBe(true);

			// Revert to original
			act(() => {
				result.current.setName('John');
			});

			expect(result.current.isDirty).toBe(false);
		});

		it('should set isDirty to true when multiple fields change', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setName('New Name');
				result.current.setLastName('New LastName');
				result.current.setBio('New bio');
			});

			expect(result.current.isDirty).toBe(true);
		});

		it('should handle isDirty correctly with empty string changes', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setName('');
			});

			expect(result.current.isDirty).toBe(true);
		});
	});

	describe('State Setters', () => {
		it('should update name', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setName('New Name');
			});

			expect(result.current.name).toBe('New Name');
		});

		it('should update lastName', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setLastName('New LastName');
			});

			expect(result.current.lastName).toBe('New LastName');
		});

		it('should update userName', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setUserName('newusername');
			});

			expect(result.current.userName).toBe('newusername');
		});

		it('should update bio', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setBio('New bio text');
			});

			expect(result.current.bio).toBe('New bio text');
		});

		it('should update avatarUrl', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setAvatarUrl('https://example.com/new.jpg');
			});

			expect(result.current.avatarUrl).toBe('https://example.com/new.jpg');
		});
	});

	describe('handleSubmit', () => {
		it('should validate and submit valid form data', async () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockEvent.preventDefault).toHaveBeenCalled();
			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'user-123',
					name: 'John',
					lastName: 'Doe',
					userName: 'johndoe',
					bio: 'Test bio',
					avatarUrl: 'https://example.com/avatar.jpg',
				}),
			);
		});

		it('should set form errors when validation fails', async () => {
			const userWithEmptyId: UserResponse = {
				...mockUser,
				userId: '',
			};

			const { result } = renderHook(() =>
				useUserUpdateForm({
					...defaultProps,
					user: userWithEmptyId,
				}),
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});
			expect(mockOnSubmit).not.toHaveBeenCalled();
		});

		it('should convert empty strings to undefined for optional fields', async () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			act(() => {
				result.current.setName('');
				result.current.setLastName('');
				result.current.setUserName('');
				result.current.setBio('');
				result.current.setAvatarUrl('');
			});

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(mockOnSubmit).toHaveBeenCalledWith(
				expect.objectContaining({
					id: 'user-123',
					name: undefined,
					lastName: undefined,
					userName: undefined,
					bio: undefined,
					avatarUrl: undefined,
				}),
			);
		});

		it('should clear form errors before submission', async () => {
			const userWithEmptyId: UserResponse = {
				...mockUser,
				userId: '',
			};

			const { result, rerender } = renderHook(
				({ user }) =>
					useUserUpdateForm({
						...defaultProps,
						user,
					}),
				{
					initialProps: { user: userWithEmptyId },
				},
			);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			// First, submit with invalid data to generate errors
			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).not.toEqual({});

			// Fix the data by updating user
			rerender({ user: mockUser });

			// Submit again
			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			expect(result.current.formErrors).toEqual({});
		});

		it('should update initialValues after successful submit without error', async () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			// Change a field
			act(() => {
				result.current.setName('New Name');
			});

			expect(result.current.isDirty).toBe(true);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// After successful submit, isDirty should be false
			expect(result.current.isDirty).toBe(false);
		});

		it('should not update initialValues when there is an error', async () => {
			const errorProps = {
				...defaultProps,
				error: new Error('Submission failed'),
			};

			const { result } = renderHook(() => useUserUpdateForm(errorProps));

			// Change a field
			act(() => {
				result.current.setName('New Name');
			});

			expect(result.current.isDirty).toBe(true);

			const mockEvent = {
				preventDefault: jest.fn(),
			} as unknown as React.FormEvent<HTMLFormElement>;

			await act(async () => {
				await result.current.handleSubmit(mockEvent);
			});

			// isDirty should still be true because there was an error
			expect(result.current.isDirty).toBe(true);
		});
	});

	describe('isSubmitting', () => {
		it('should reflect isLoading state', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			expect(result.current.isSubmitting).toBe(false);
		});

		it('should be true when isLoading is true', () => {
			const { result } = renderHook(() =>
				useUserUpdateForm({
					...defaultProps,
					isLoading: true,
				}),
			);

			expect(result.current.isSubmitting).toBe(true);
		});
	});

	describe('updateSchema', () => {
		it('should create schema with translations', () => {
			const { result } = renderHook(() => useUserUpdateForm(defaultProps));

			expect(result.current.updateSchema).toBeDefined();
		});

		it('should memoize schema based on translations', () => {
			const { result, rerender } = renderHook(
				({ t }) =>
					useUserUpdateForm({
						...defaultProps,
						t,
					}),
				{
					initialProps: { t: mockTranslations },
				},
			);

			const firstSchema = result.current.updateSchema;

			// Rerender with same translations
			rerender({ t: mockTranslations });

			expect(result.current.updateSchema).toBe(firstSchema);

			// Rerender with different translations
			const newTranslations = (key: string) => `new_${key}`;
			rerender({ t: newTranslations });

			expect(result.current.updateSchema).not.toBe(firstSchema);
		});
	});
});
