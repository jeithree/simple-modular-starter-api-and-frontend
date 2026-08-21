// eslint-disable-next-line import/no-anonymous-default-export
export default {
	apps: [
		{
			name: 'frontend',
			cwd: '/home/user-frontend/htdocs/app.jeitdev.com/frontend',
			script: 'npm',
			args: 'start',
            interpreter: 'none',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
