export default {
	apps: [
		{
			name: 'api',
			cwd: '/home/user-api/htdocs/api.jeitdev.com',
			script: 'npm',
			args: 'start',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
