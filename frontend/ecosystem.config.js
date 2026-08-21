// eslint-disable-next-line import/no-anonymous-default-export
export default {
	apps: [
		{
			name: 'frontend',
			cwd: '/home/user-frontend/htdocs/app.jeitdev.com',
			script: 'npm',
			args: 'start',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
