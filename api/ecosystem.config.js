export default {
	apps: [
		{
			name: 'api',
			cwd: '/home/user-api/htdocs/api.jeitdev.com/api',
			script: 'npm',
			args: 'start',
            interpreter: 'none',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
