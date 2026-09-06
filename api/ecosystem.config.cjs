module.exports = {
	apps: [
		{
			name: 'api',
			script: 'src/app/server.ts',
			node_args: '--env-file=.env',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
