import { Logger } from '@/services/LoggerService';

import { getErrorMessage, getErrorStatusCode } from '@/helpers/response_collection';
import { UserAccountInterface } from '@/interfaces/UserAccountInterface';
import UserService from '@/services/UserService';
import { Request, Response, NextFunction } from 'express';
import jwtMiddleware from './jwt.middleware';
import MailCodeService from '@/services/MailCodeService';
import ProjectService from '@/services/ProjectService';

class AuthMiddleware {
	async verifyUserPassword(req: Request, res: Response, next: NextFunction) {
		const mailCodeService = new MailCodeService();
		const userService = new UserService();
		try {
			// const user: any = await userService.fetchUserByUsernameNPassword(req.body);
			const {
				id,
				code,
				login_format
			} = req.body;

			if (!login_format) throw Error(getErrorMessage('invalidLoginFormat'));
			if (login_format === 'email') {
				const isValidEmailCode = await mailCodeService.isValidEmailCode(id, code);
				const mailCode = await mailCodeService.fetch(id);

				if (!mailCode) throw Error(getErrorMessage('registryNotFound', 'código de verificação'));
				if (!isValidEmailCode) throw Error(getErrorMessage('invalidEmailCode'));

				const user: UserAccountInterface | null = await userService.fetchByEmail(String(mailCode?.email));
				if (!user) {
					return res
						.status(getErrorStatusCode('invalidLoginCredentials'))
						.send({ message: getErrorMessage('invalidLoginCredentials') });
				}
				await mailCodeService.update({ status: 'USD' }, id);
				req.body.user_id = user.id;
			} else {
				throw Error(getErrorMessage('invalidLoginFormat'));
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			return res.status(500).send({ message: err?.message || err });
		}
		return next();
		// Giving the same message in both cases
		// helps protect aganist cracking attempts:
	}

	async validateBasic(req: Request, res: Response, next: NextFunction) {
		const projectService = new ProjectService();
		try {
			const authorization = req.headers?.authorization?.split(' ') || [];

			if (authorization.length != 2) throw Error(getErrorMessage('missingField', 'Nome de usuario e/ou senha'));

			const credentials = decodeURI(Buffer.from(authorization[1], 'base64').toString()).split(':');
			console.log(credentials);
			const project = await projectService.fetchByOrganizationIdNApiKey({ organization_id: credentials[0], api_key: credentials[1] });

			if (project.length === 0) throw Error(getErrorMessage('wrongCredential'));

			res.locals.user_id = project[0].user_account_id;
			res.locals.project_id = project[0].id;
			next();
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			Logger.getInstance().error('AUTHMiddleware', err?.message || err);
			return res.status(500).send({ message: 'Erro desconhecido ao validor token de acesso' });
		}
	}

	async validateBaiscOrBearer(req: Request, res: Response, next: NextFunction) {
		// if(req.headers['origin'] && req.headers['origin'] === 'http://localhost') next();
		try {
			if (req.headers['authorization'] && req.headers['authorization'].includes('Basic')) this.validateBasic(req, res, next);
			else jwtMiddleware.validJWTNeeded(req, res, next);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			Logger.getInstance().error('AUTHMiddleware', err?.message || err);
			return res.status(500).send({ message: 'Erro desconhecido ao validor token de acesso' });
		}
	}
}

export default new AuthMiddleware();
