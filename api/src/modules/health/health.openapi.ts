import {z} from 'zod';
import {registry} from '../../openapi/registry.ts';
import {
	createSuccessResponseSchema,
} from '../../openapi/schemas/apiResponse.ts';

export const registerHealthOpenApi = () => {
    const healthResponseSchema = registry.register(
        'HealthResponse',
        createSuccessResponseSchema(
            z.object({
                message: z.string(),
            }),
        ),
    );


    registry.registerPath({
        method: 'get',
        path: '/api/v1/health',
        summary: 'Health check endpoint',
        tags: ['Health'],
        responses: {
            200: {
                description: 'API is healthy',
                content: {'application/json': {schema: healthResponseSchema}},
            },
        },
    });
}