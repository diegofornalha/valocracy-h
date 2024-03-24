import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import UserService from '@/services/UserService';
import { UserAccountInsertBodyInterface, UserAccountInterface, UserAccountUpdateInterface } from '@/interfaces/UserAccountInterface';
import Database from '@/database/Database';
import AuthController from './AuthController';
import MailCodeService from '@/services/MailCodeService';
import ProjectService from '@/services/ProjectService';
import DiscordService from '@/services/DiscordService';
import { DiscordUserInterface } from '@/interfaces/DiscordInterface';
import { UserValidationType } from '@/enums/UserValidationTypeEnum';
import HotmartAccountService from '@/services/HotmartAccountService';
import { HotmartAccountInterface } from '@/interfaces/HotmartAccountInterface';
import UserMetamaskService from '@/services/UserMetamaskService';
import { UserMetamaskInterface } from '@/interfaces/UserMetamaskInterface';
import { isUserAdm } from '@/helpers/permission_system';

class UserController extends Controller {
	private service: UserService;

	constructor() {
		super();
		this.service = new UserService();
	}

	async fetch(req: Request, res: Response) {
		const discordService = new DiscordService();
		const hotmartService = new HotmartAccountService();
		const metamaskService = new UserMetamaskService();

		try {
			const userId: number = Number(res.locals.jwt.user_id);

			const user: UserAccountInterface | null = await this.service.fetchForFront(userId);
			if (!user) throw Error(getErrorMessage('registryNotFound', 'Usuário'));

			const [discordUser, userHotmartsStatus, userMetamask]: [DiscordUserInterface | null, Array<HotmartAccountInterface>, Array<UserMetamaskInterface>] = await Promise.all([
				discordService.fetchByUserId(userId),
				hotmartService.getActiveEmail(String(user.email), userId),
				metamaskService.fetchByUserAccount(userId)
			]);
			const isAdmin = await isUserAdm(userId);
			console.log('Discord user data', discordUser);
			console.log('Is Admin', isAdmin);

			return this.sendSuccessResponse(res, { content: { ...user, is_admin: isAdmin, discord: discordUser, hotmarts: userHotmartsStatus, metamask: userMetamask.length > 0 ? userMetamask[0] : null } });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async fetchAll(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);

			const isAdmin = await isUserAdm(userId);
			console.log('Is Admin', isAdmin);
			if(!isAdmin) throw Error(getErrorMessage('userActionNotPermitted'));

			const users = await this.service.fetchAll();
			return this.sendSuccessResponse(res, { content: users });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async fetchIsEmailUnique(req: Request, res: Response) {
		try {
			const isUnique = (await this.service.fetchByEmail(req.params.email)) === null;

			return this.sendSuccessResponse(res, { content: { is_unique: isUnique } });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async fetchIsUsernameUnique(req: Request, res: Response) {
		try {
			const isUnique = await this.service.fetchIsUsernameUnique(req.params.username);

			return this.sendSuccessResponse(res, { content: { is_unique: isUnique } });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async create(req: Request, res: Response) {
		const mailCodeService = new MailCodeService();
		const authController = new AuthController();

		try {
			const body: UserAccountInsertBodyInterface = req.body;

			const user = await this.service.fetchByEmail(body.email);
			if (user !== null) throw Error(getErrorMessage('emailAlreadyExist'));

			if (!body?.validation || Object.keys(body.validation).length === 0) throw Error(getErrorMessage('missingField', 'Validação'));
			if (body.validation.validation_type === UserValidationType.EMAIL) await mailCodeService.validateEmailCode(body.validation?.id, body.validation?.code);

			await Database.startTransaction();
			const userId = await this.service.create(body);
			req.body.user_id = userId;

			if (body.validation.validation_type === UserValidationType.EMAIL) await mailCodeService.update({ status: 'USD' }, body?.validation?.id);
			await Database.commit();
			return await authController.createJWT(req, res);
		} catch (err) {
			await Database.rollback();
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async update(req: Request, res: Response) {
		const userService = new UserService();

		try {
			const body: UserAccountUpdateInterface = req.body;
			const userId: number = Number(res.locals.jwt.user_id);

			const user: UserAccountInterface | null = await userService.fetch(userId);

			if (!user) throw Error(getErrorMessage('registryNotFound', 'Usuario'));

			await userService.update(body, userId);
			return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Usuario') });
		} catch (err) {
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async delete(req: Request, res: Response) {
		const projectService = new ProjectService();

		try {
			const userId: number = Number(res.locals.jwt.user_id);
			Database.startTransaction();
			await projectService.removeByUserAcc(userId);
			await this.service.remove(userId);
			Database.commit();
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Usuario') });
		} catch (err) {
			Database.rollback();
			this.sendErrorMessage(res, err, 'UserController');
		}
	}
}

export default UserController;
