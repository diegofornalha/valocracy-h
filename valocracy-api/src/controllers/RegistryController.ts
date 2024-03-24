import { Request, Response } from 'express';

import { getErrorMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import MailCodeService from '@/services/MailCodeService';
import UserService from '@/services/UserService';
import { MailCodeInterface } from '@/interfaces/MailCodeInterface';
import RegistryService from '@/services/RegistryService';

class RegistryController extends Controller {
	private service: RegistryService;

	constructor() {
		super();
		this.service = new RegistryService();
	}

	async sendValidationCode(req: Request, res: Response) {
		const userService = new UserService();
		const mailCodeService = new MailCodeService();

		try {
			const body = req.body;

			const user = await userService.fetchByEmail(body.email);
			if (user !== null) throw Error(getErrorMessage('emailAlreadyExist'));

			const mailCode: MailCodeInterface = await mailCodeService.getNewMailCode(body?.email);
			const sendMailBody = {
				recipient_email: body.email,
				code: mailCode.code,
				username: body.username
			};
			const mailCodeId = Number(mailCode.id);
			console.log('CODEE =>', mailCode?.code);

			await this.service.sendMailCode(sendMailBody);

			await mailCodeService.update({ status: 'SND' }, mailCodeId);

			return this.sendSuccessResponse(res, { content: { id: mailCodeId } });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async validateEmail(req: Request, res: Response) {
		const mailCodeService = new MailCodeService();

		try {
			const {
				id,
				code
			} = req.params;

			const isValidEmail = await mailCodeService.isValidEmailCode(Number(id), code);
			return this.sendSuccessResponse(res, { content: { is_valid: isValidEmail } });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}
}

export default RegistryController;