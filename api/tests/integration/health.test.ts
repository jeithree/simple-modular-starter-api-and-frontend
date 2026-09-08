import {describe, it, expect} from 'vitest';
import request from 'supertest';
import app from '../../src/app/app.ts';

describe('Health Check Integration Tests', () => {
	it('should return a successful health check response', async () => {
		const res = await request(app).get('/api/v1/health');

		expect(res.statusCode).toBe(200);
		expect(res.body).toHaveProperty('success', true);
		expect(res.body).toHaveProperty('message', 'API is healthy');
	});
});
