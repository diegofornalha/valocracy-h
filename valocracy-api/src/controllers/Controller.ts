import Database from '@/database/Database';
import { Logger } from '@/services/LoggerService';
import { Response } from 'express';

class Controller {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	protected logger: any = null;
	public static errorStatusCode = 500;
	public static errorProcessedByGPT = false;

	constructor() {
		this.logger = Logger.getInstance();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async sendSuccessResponse(res: Response, { message = '', content = null, status = -1 }: any) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const response: any = {

		};

		if (status != -1) response.status = status;
		if (message) response.message = message;
		if (content != null) response.content = content;

		await Database.release();
		return res.status(200).send(response).end();
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async sendErrorMessage(res: Response, err: any, errorControllerOrigin: any, extraResponseData: any = null) {
		const errorMessage = err?.message || err;

		(await this.logger).error(errorControllerOrigin, errorMessage);
		await Database.release();
		return res.status(Controller.errorStatusCode).send({ message: errorMessage, content: extraResponseData }).end();
	}

}

export default Controller;