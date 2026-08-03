import {describe, it, expect} from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.ts';

describe('API Docs', () => {
	it('should serve the docs page', async () => {
		const res = await request(app).get('/docs/');

		expect(res.statusCode).toBe(200);
		expect(res.headers['content-type']).toContain('text/html');
		expect(res.text).toContain('API Documentation');
	});

	it('should serve the openapi document', async () => {
		const res = await request(app).get('/docs/openapi.json');

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('openapi', '3.0.3');
		expect(res.body.paths).toHaveProperty('/api/v1/auth/register');
		expect(res.body.paths).toHaveProperty('/api/v1/admin/users/{id}');
	});
});
