import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { IClerkUser } from '@/generic/auth/domain/interfaces/clerk-user.interface';

/**
 * Current User Decorator
 * Extracts the authenticated user from the request (Clerk user)
 */
export const CurrentUser = createParamDecorator(
	(data: unknown, context: ExecutionContext): IClerkUser => {
		const ctx = GqlExecutionContext.create(context);
		return ctx.getContext().req.user;
	},
);
