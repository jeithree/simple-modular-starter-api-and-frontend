module.exports = {
	apps: [
		{
			name: 'frontend',
			cwd: '/home/user-frontend/htdocs/app.jeitdev.com/frontend',
			script: 'node_modules/next/dist/bin/next',
            args: 'start -p 3000',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
};
