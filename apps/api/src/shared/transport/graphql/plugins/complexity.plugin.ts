import { Plugin } from '@nestjs/apollo';
import { ApolloServerPlugin, GraphQLRequestContext, GraphQLRequestListener } from '@apollo/server';
import { GraphQLError } from 'graphql';
import { fieldExtensionsEstimator, getComplexity, simpleEstimator } from 'graphql-query-complexity';

const MAX_COMPLEXITY = 1000;

@Plugin()
export class ComplexityPlugin implements ApolloServerPlugin {
	async requestDidStart(
		requestContext: GraphQLRequestContext<Record<string, unknown>>,
	): Promise<GraphQLRequestListener<Record<string, unknown>>> {
		const { schema } = requestContext;

		return {
			async didResolveOperation({ request, document }) {
				const complexity = getComplexity({
					schema,
					operationName: request.operationName,
					query: document,
					variables: request.variables,
					estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
				});

				if (complexity > MAX_COMPLEXITY) {
					throw new GraphQLError(
						`Query complexity ${complexity} exceeds the maximum allowed complexity of ${MAX_COMPLEXITY}`,
						{ extensions: { code: 'QUERY_COMPLEXITY_EXCEEDED' } },
					);
				}
			},
		};
	}
}
