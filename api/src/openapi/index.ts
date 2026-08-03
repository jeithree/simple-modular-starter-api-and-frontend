import {OpenApiGeneratorV3} from '@asteasolutions/zod-to-openapi';
import {registry} from './registry.ts';

import {registerAdminOpenApi} from '../modules/admin/admin.openapi.ts';
import {registerAuthOpenApi} from '../modules/auth/auth.openapi.ts';
import {registerUserOpenApi} from '../modules/user/user.openapi.ts';

registerAdminOpenApi();
registerAuthOpenApi();
registerUserOpenApi();

export const buildOpenApiDocument = () => {
	const generator = new OpenApiGeneratorV3(registry.definitions);

	return generator.generateDocument({
		openapi: '3.0.3',
		info: {
			title: 'Simple API Starter Template',
			version: '1.0.0',
		},
		servers: [{url: '/', description: 'Same origin'}],
	});
};
