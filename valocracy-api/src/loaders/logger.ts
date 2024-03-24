import * as winston from 'winston';
import * as expressWinston from 'express-winston';
import env from '@/config';

const loggerOptions: expressWinston.LoggerOptions = {
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.json(),
		winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
		winston.format.prettyPrint(),
		winston.format.colorize({ all: true })
	),
};

if (!env.DEBUG) {
	loggerOptions.meta = false; // when not debugging, log requests as one-liners
}

export default expressWinston.logger(loggerOptions);
