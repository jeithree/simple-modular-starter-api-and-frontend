import app from './app.ts';
import {logger} from '../helpers/logger.ts';
import {init} from './init.ts';

await init();
const PORT = app.get('port');

app.listen(PORT, () => {
	logger.info(
		{
			port: PORT,
			url: `http://localhost:${PORT}`,
		},
		'Server started',
	);
});

const gracefulShutdown = async () => {
	try {
		logger.info('Shutting down gracefully...');
		process.exit(0);
	} catch (error) {
		logger.error({err: error}, 'Error during shutdown');
		process.exit(1);
	}
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);
