export default {
    apps: [
        {
            name: 'api',
            cwd: '/home/user-api/htdocs/api.jeitdev.com/api',
            script: '/home/user-api/.nvm/versions/node/v24.19.0/bin/npm',
            args: 'start',
            interpreter: 'none',
            env: {
                NODE_ENV: 'production',
            },
        },
    ],
};
