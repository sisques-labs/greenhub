/**
 * Clerk User Interface
 * Represents the authenticated user from Clerk
 */
export interface IClerkUser {
	id: string;
	userId: string;
	clerkUserId: string;
	email: string | null;
	username: string | null;
	firstName: string | null;
	lastName: string | null;
	role: string;
	clerkUser?: any;
	sessionId?: string;
}
