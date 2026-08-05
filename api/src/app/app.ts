import express from 'express';
import {pinoHttp} from 'pino-http';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import cors from 'cors';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import {RedisStore} from 'connect-redis';
import redisClient from '../redisClient.ts';
import {
	PORT,
	API_URL,
	SESSION_SECRET,
	SESSION_KEY_PREFIX,
	IS_DEV_MODE,
	IS_TEST_MODE,
} from '../configs/basics.ts';
import {SESSION_COOKIE} from '../configs/cookies.ts';
import {errorHandler} from '../middlewares/errorHandler.ts';
import {logger} from '../helpers/logger.ts';
import router from './routes.ts';
import {buildOpenApiDocument} from '../openapi/index.ts';

const app = express();
const openApiDocument = buildOpenApiDocument();

// Settings
app.set('trust proxy', 1);
app.set('port', PORT);

// Middlewares
app.use(
	pinoHttp({
		logger,
		serializers: {
			req(req) {
				return {
					id: req.id,
					method: req.method,
					url: req.url,
					ip: req.ip,
				};
			},

			res(res) {
				return {
					statusCode: res.statusCode,
				};
			},
		},
	}),
);
app.use(helmet());
app.use(
	cors({
		origin: [API_URL],
		credentials: true,
	}),
);
app.use(express.urlencoded({extended: false, limit: '10mb'}));
app.use(express.json({limit: '10mb'}));
app.use(cookieParser(SESSION_SECRET));
app.use(
	session({
		name: SESSION_COOKIE.name,
		secret: [SESSION_SECRET], // first element has to be the new secret, read Docs
		resave: false,
		saveUninitialized: false,
		cookie: SESSION_COOKIE.options,
		store: new RedisStore({
			client: redisClient,
			prefix: SESSION_KEY_PREFIX,
		}),
	}),
);

const ENABLE_DOCS = IS_DEV_MODE || IS_TEST_MODE;

if (ENABLE_DOCS) {
	app.get('/docs/openapi.json', (_req, res) => {
		res.json(openApiDocument);
	});

	app.use(
		'/docs',
		swaggerUi.serve,
		swaggerUi.setup(openApiDocument, {
			customSiteTitle: 'API Documentation',
		}),
	);
}

// Routes
app.use('/api/v1', router);

// Error Handler
app.use(errorHandler);

export default app;
