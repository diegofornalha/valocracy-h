import winston, { Logform } from 'winston';
import { createLogger, format } from 'winston';
const { combine, timestamp, label, printf, errors } = format;


class PrivateLogger {
	private format: Logform.Format;
	private logger: winston.Logger;
	private levels = {
		error: 0,
		warn: 1,
		info: 2,
		http: 3,
		debug: 4,
	};

	private level = () => {
		const env = process.env.NODE_ENV || 'development';
		const isDevelopment = env === 'development';
		return isDevelopment ? 'debug' : 'warn';
	};

	private colors = {
		error: 'red',
		warn: 'yellow',
		info: 'green',
		http: 'magenta',
		debug: 'white',
	};

	constructor() {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		this.format = printf((info: any) => {
			return `{ "timestamp": "${info.timestamp}", "service": "${info.label}", "level": "${info.level}", "message": "${info.message}" }`;
		});

		// const logger = winston.createLogger({
		//     transports: [
		//       new winston.transports.Console()
		//     ]
		// });
		this.logger = createLogger({
			level: this.level(),
			...this.levels,
			transports: [
				new winston.transports.Console(),
				new winston.transports.File({
					filename: './logs/combined.log'
				}),
				new winston.transports.File({
					filename: './logs/debug.log',
					level: 'debug',
				}),
				new winston.transports.File({
					filename: 'logs/error.log',
					level: 'error',
				}),
			],
			format: combine(
				label({ label: 'filename!' }),
				timestamp(),
				errors({ stack: true }),
				// colorize({ all: true }),
				this.format
			)
		});

		// this.loggerRequest = createLogger({
		//     transports: [
		//         new winston.transports.Console(),
		//         new winston.transports.File({
		//             filename: './logs/request.log',
		//         })
		//     ],
		//     format: combine(
		//         label({ label: 'filename!' }),
		//         timestamp(),
		//         format.splat(),
		//         format.simple()
		//     )
		// });
		// this.logger.warn('Hello again distributed logs');
	}

	changeLabel(filename: string) {
		this.logger.format = combine(
			label({ label: filename }),
			timestamp(),
			// colorize({ all: true }),
			this.format
		);
		// this.loggerRequest.format = combine(
		//     label({ label: filename }),
		//     timestamp(),
		//     format.splat(),
		//     format.simple()
		// );
	}

	public error(filename: string, message: string) {
		this.changeLabel(filename);
		this.logger.error(message);
	}

	public warn(filename: string, message: string) {
		this.changeLabel(filename);
		this.logger.warn(message);
	}

	public info(filename: string, message: string) {
		this.changeLabel(filename);
		this.logger.info(message);
	}

	public http(message: string) {
		this.changeLabel('HTTP');
		this.logger.http(message);
	}

	public verbose(filename: string, message: string) {
		this.changeLabel(filename);
		this.logger.verbose(message);
	}

	public debug(filename: string, message: string) {
		this.changeLabel(filename);
		this.logger.debug(message);
	}

	public silly(filename: string, message: string) {
		this.changeLabel(filename);
		this.logger.silly(message);
	}
}

class Logger {
	private static instance: PrivateLogger | null = null;

	constructor() {
		throw new Error('Use Logger.getInstance()');
	}

	static getInstance(): PrivateLogger {
		if (!Logger.instance) {
			Logger.instance = new PrivateLogger();
		}
		return Logger.instance;
	}
}


export {
	Logger,
	PrivateLogger
};