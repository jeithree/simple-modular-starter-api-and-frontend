module.exports = {
	apps: [
		{
			name: 'api',
			cwd: '/home/user-api/htdocs/api.jeitdev.com/api',
			script: 'src/app/server.ts',
			node_args: '--env-file=.env',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
