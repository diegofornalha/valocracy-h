/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import MailCodeService from '@/services/MailCodeService';
import Controller from './Controller';
import AuthService from '@/services/AuthService';
import { UserAccountInterface } from '@/interfaces/UserAccountInterface';
import UserService from '@/services/UserService';
import { getErrorMessage } from '@/helpers/response_collection';

class AuthController extends Controller {
	private service: AuthService;
	private userService: UserService;

	constructor() {
		super();
		this.service = new AuthService();
		this.userService = new UserService();
	}

	async sendLoginCode(req: Request, res: Response) {
		const mailCodeService = new MailCodeService();
		
		try {
			const body = req.body;
			const { email } = body;
			const userEmailOwner: UserAccountInterface | null = await this.userService.fetchByEmail(email);

			if (userEmailOwner) {
				const mailCode = await mailCodeService.getNewMailCode(email);
				const mailCodeId = Number(mailCode.id);
				const mailCodeCode = mailCode.code;
	
				const sendMailBody = {
					recipient_email: body.email,
					code: mailCodeCode,
					username: userEmailOwner.username
				};
				console.log(sendMailBody);
				await this.service.sendMailCode(sendMailBody);
				await mailCodeService.update({ status: 'SND' }, mailCodeId);

				return this.sendSuccessResponse(res, { content: { code_id: mailCodeId } });
			} else {
				throw Error(getErrorMessage('registryNotFound', 'Usuário'));				
			}

		} catch (err) {
			const errorMessage = typeof err === 'string' ?  err : (err as any)?.message;

			const extraResponseData = getErrorMessage('registryNotFound', 'Usuário') === errorMessage ? { user_not_cadastred: true } : null; 
			this.sendErrorMessage(res, err, 'AuthController', extraResponseData);
		}
	}

	async createJWT(req: Request, res: Response) {
		try {
			const jwt = await this.service.getNewJWT(req.body);

			return this.sendSuccessResponse(res, { content: jwt });
		} catch (err) {
			this.sendErrorMessage(res, err, 'AuthController');
		}
	}
}

export default AuthController;
