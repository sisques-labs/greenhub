/**
 * Clerk User Interface
 * Represents the authenticated user from Clerk
 */
export interface IClerkUser {
	id: string;
	userId: string;
	clerkUserId: string;
	tenantId?: string | null;
	clerkOrgId?: string | null;
	email: string | null;
	username: string | null;
	firstName: string | null;
	lastName: string | null;
	role: string;
	clerkUser?: any;
	internalTenant?: any;
	sessionId?: string;
}
