import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import UserService from '@/services/UserService';
import Database from '@/database/Database';
import { DiscordUserInterface } from '@/interfaces/DiscordInterface';
import DiscordService from '@/services/DiscordService';

class DiscordController extends Controller {
	private service: DiscordService;

	constructor() {
		super();
		this.service = new DiscordService();
	}

	async registry(req: Request, res: Response) {
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const authResult: any = await this.service.auth(req.body);
			
			if (!authResult?.user) throw Error(getErrorMessage('discordUserDataNotFound'));

			this.sendSuccessResponse(res, { content: authResult });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ApplicationKey');
		}
	}

	async syncDiscordUser(req: Request, res: Response) {
		const userService = new UserService();

		try {
			const userId: number = Number(res.locals.jwt.user_id);
			// console.log({ userId });

			const user: DiscordUserInterface | null = await this.service.fetchByUserId(userId);
			if (user) throw Error('Discord já sincronizado');

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const authDiscord: any = await this.service.auth(req.body);

			const userDiscord = {
				user_id: userId,
				discord_id: authDiscord?.user?.id,
				discord_name: authDiscord?.user?.username,
				discord_avatar: authDiscord?.user?.avatar,
				discord_global_name: authDiscord?.user?.global_name,
				discord_banner_color: authDiscord?.user?.banner_color,
				discord_joined_at_guilda: authDiscord?.guilda_user_info?.joined_at,
				discord_guilda_roles: authDiscord?.guilda_user_info?.roles?.join('|'),
			};

			// console.log('SINCRONIZAR USER DISCORD', userDiscord);
			await this.service.create(userDiscord);

			const userResponse = await userService.fetch(userId);

			// console.log('syncDiscordUser', userResponse);

			return this.sendSuccessResponse(res, {
				content: {
					user: userResponse,
					user_discord: userDiscord
				}
			});
		} catch (err) {
			this.sendErrorMessage(res, err, 'ApplicationKey');
		}
	}

	// async authRedirect(req: Request, res: Response) {
	// 	const code = req.query.code;
	// 	return res.writeHead(301, {
	// 		Location: `http://localhost:5173/discord/conta/cadastro?code=${code}`
	// 	}).end();
	// }

	async create(req: Request, res: Response) {
		try {
			//USER ID
			const userId: number = Number(res.locals.jwt.user_id);
			const user: DiscordUserInterface | null = await this.service.fetchByUserId(userId);
			if (user) throw Error('Discord já sincronizado');

			const body: DiscordUserInterface = req.body;
			body.user_id = userId;
			console.log({ body });

			await Database.startTransaction();
			const userInsertId = await this.service.create(body);
			await Database.commit();

			return this.sendSuccessResponse(res, { message: 'Dados do discord vínculado ao usuário com sucesso', content: { insert_user_discord_id: userInsertId } });
		} catch (err) {
			await Database.rollback();
			this.sendErrorMessage(res, err, 'UserController');
		}
	}

	async delete(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			
			await this.service.removeByUser(userId);
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Vinculo com discord') });
		} catch (err) {
			Database.rollback();
			this.sendErrorMessage(res, err, 'UserController');
		}
	}
}

export default DiscordController;