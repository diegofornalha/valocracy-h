import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import Database from '@/database/Database';
import ExternalAccessService from '@/services/ExternalAccessService';
import { UserValidationType } from '@/enums/UserValidationTypeEnum';
import MailCodeService from '@/services/MailCodeService';
import UserService from '@/services/UserService';
import { UserAccountInterface } from '@/interfaces/UserAccountInterface';
import HotmartAccountService from '@/services/HotmartAccountService';

class ExternalAccessController extends Controller {
	private service: ExternalAccessService;

	constructor() {
		super();
		this.service = new ExternalAccessService();
	}

	async sendValidationCode(req: Request, res: Response) {
		const mailCodeService = new MailCodeService();
		const userAccountServce = new UserService();
		try {
			const body = req.body;
			const userId: number = Number(res.locals?.jwt?.user_id) || 0;
			const userEmailOwner: UserAccountInterface | null = await userAccountServce.fetch(userId);
			const mailCode = await mailCodeService.getNewMailCode(body.email);
			const mailCodeId = Number(mailCode.id);
			const mailCodeCode = mailCode.code;

			const sendMailBody = {
				recipient_email: body.email,
				code: mailCodeCode,
				username: userEmailOwner?.username
			};
			console.log(sendMailBody);
			await this.service.sendMailCode(sendMailBody);
			await mailCodeService.update({ status: 'SND' }, mailCodeId);

			return this.sendSuccessResponse(res, { message: getSuccessMessage('emailSended'), content: { code_id: mailCodeId } });
		} catch (err) {
			await Database.rollback();
			this.sendErrorMessage(res, err, 'ExternalAccessController');
		}
	}

	async create(req: Request, res: Response) {
		const mailCodeService = new MailCodeService();

		try {
			const body = req.body;
			const userId: number = res.locals.jwt.user_id;
			const isEmailInList: boolean = await this.service.isEmailInList(body.email);
			if (isEmailInList) throw Error(getErrorMessage('emailAlreadyExist'));

			const userAlreadyHasEmail: boolean = await this.service.userHasEmailInList(body.email);
			if (userAlreadyHasEmail) throw Error(getErrorMessage('emailAlreadyExist'));

			if (!body?.validation || Object.keys(body.validation).length === 0) throw Error(getErrorMessage('missingField', 'Validação'));
			if (body.validation.validation_type === UserValidationType.EMAIL) await mailCodeService.validateEmailCode(body.validation?.id, body.validation?.code);

			await Database.startTransaction();
			req.body.user_account_id = userId;
			await this.service.create(body);

			if (body.validation.validation_type === UserValidationType.EMAIL) await mailCodeService.update({ status: 'USD' }, body?.validation?.id);
			await Database.commit();
			return this.sendSuccessResponse(res, { message: getSuccessMessage('insert', 'Acesso') });
		} catch (err) {
			await Database.rollback();
			this.sendErrorMessage(res, err, 'ExternalAccessController');
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const userHasExternalAcc = await this.service.fetchByUser(userId);

			if(userHasExternalAcc.length > 0) {
				await this.service.removeByUser(userId);
			}else {
				const hotmartAccountService = new HotmartAccountService();
				const userAccountService = new UserService();

				const user = await userAccountService.fetch(userId);
				const hotmartAccount = await hotmartAccountService.fetchByEmail(String(user?.email));
				console.log(hotmartAccount);
				if(hotmartAccount != null) {
					await userAccountService.update({ ignore_original_hotmart_account: true }, userId);
				}
			}
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Vinculo com hotmart') });
		} catch (err) {
			Database.rollback();
			this.sendErrorMessage(res, err, 'UserController');
		}
	}
}

export default ExternalAccessController;
