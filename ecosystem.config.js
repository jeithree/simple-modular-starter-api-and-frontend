export default {
	apps: [
		{
			name: 'frontend',
			cwd: '/home/cloudpanel/htdocs/example.com/frontend',
			script: 'npm',
			args: 'start',
			env: {
				NODE_ENV: 'production',
			},
		},
		{
			name: 'api',
			cwd: '/home/cloudpanel/htdocs/api.example.com/api',
			script: 'npm',
			args: 'start',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
