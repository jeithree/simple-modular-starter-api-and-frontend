module.exports = {
    apps: [
        {
            name: 'api',
            cwd: '/home/user-api/htdocs/api.jeitdev.com/api',
            script: 'node --env-file=.env src/app/server.ts',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
