import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthPageStore {
	email: string;
	setEmail: (email: string) => void;
	password: string;
	setPassword: (password: string) => void;
	confirmPassword: string;
	setConfirmPassword: (confirmPassword: string) => void;
	isLoginMode: boolean;
	setIsLoginMode: (isLoginMode: boolean) => void;
}

export const useAuthPageStore = create<AuthPageStore>()(
	persist(
		(set) => ({
			email: "",
			setEmail: (email) => set({ email }),
			password: "",
			setPassword: (password) => set({ password }),
			confirmPassword: "",
			setConfirmPassword: (confirmPassword) => set({ confirmPassword }),
			isLoginMode: true,
			setIsLoginMode: (isLoginMode) => set({ isLoginMode }),
		}),
		{ name: "auth-page-store" },
	),
);
