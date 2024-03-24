import env from '@/config';
import { getErrorMessage } from '@/helpers/response_collection';
import { request } from '@/helpers/util';
import { UserGuild } from '@/interfaces/types/user_guilds';
import { DiscordUserInterface } from '@/interfaces/DiscordInterface';
import DiscordDatabase from '@/database/DiscordDatabase';

class DiscordService {
	private url: string;
	private authToken: string;
	private clientId: string;
	private clientSecret: string;
	private redirectUri: string;
	private guildaDiscordId: string;
	private database: DiscordDatabase;

	constructor() {
		this.url = env.DISCORD_API_ENDPOINT;
		this.authToken = env.DISCORD_TOKEN;
		this.clientId = env.DISCORD_CLIENT_ID;
		this.clientSecret = env.DISCORD_CLIENT_SECRET;
		this.redirectUri = env.DISCORD_REDIRECT_URI;
		this.guildaDiscordId = env.DISCORD_SERVER_ID;
		this.database = new DiscordDatabase();
	}

	private async getExpiration(expires_in: number) {
		const date = new Date();
		const dateBr = new Date((date.getTime()) + (expires_in * 1000));

		return dateBr;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private async getApi(params: any, headers: any = null) {
		const response = await request('get', `${this.url}${params}`, headers);

		return response;
	}

	private async refreshToken(refreshToken: string) {
		const data = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: 'refresh_token',
			refresh_token: refreshToken
		};

		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept-Encoding': 'application/x-www-form-urlencoded'
			}
		};

		const response = await request('post', `${this.url}/oauth2/token`, config, data);

		return response;
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	async auth(data: any) {
		if (!data?.code) throw Error(getErrorMessage('missingField', 'Codigo do discord'));

		console.log('CODE DISCORD', data.code);
		
		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Accept-Encoding': 'application/x-www-form-urlencoded'
			}
		};

		const requestData = {
			client_id: this.clientId,
			client_secret: this.clientSecret,
			grant_type: 'authorization_code',
			code: data.code,
			redirect_uri: this.redirectUri
		};

		console.log(requestData);
		console.log(`${this.url}/oauth2/token`);
		const response = await request('post', `${this.url}/oauth2/token`, config, requestData);
		
		console.log('this.guildaDiscordId', this.guildaDiscordId);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const refreshTokenResponse: any = await this.refreshToken(response.refresh_token);

		const userConfig = {
			headers: {
				authorization: `Bearer ${refreshTokenResponse.access_token}`
			}
		};
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const [user, guildaUserInfo]: [DiscordUserInterface, UserGuild, any, Date] = await Promise.all([
			this.getApi('/users/@me', userConfig),// retorna indo do user 
			this.getApi('/users/@me/guilds', userConfig),//retorna todos os servidores do user
			this.getApi(`/users/@me/guilds/${this.guildaDiscordId}/member`, userConfig),//retorna todos os servidores do user
			this.getExpiration(refreshTokenResponse.expires_in)
		]);
		//verifica se user está na guilda 
		//const guildaCheck = userGuilds.filter(e => e.id == this.guildaDiscordId)
		return {
			user: user,
			guilda_user_info: guildaUserInfo
		};
	}

	private async getRecipientInfo(userId: number) {
		const config = {
			headers: {
				Authorization: `Bot ${this.authToken}`,
				'Content-Type': 'application/json',
			}
		};

		return await request('post', `${this.url}/users/@me/channels`, config, { recipient_id: userId });
	}

	private async getUserGuildData(guildId: string, userId: number) {
		const config = {
			headers: {
				Authorization: `Bot ${this.authToken}`,
				'Content-Type': 'application/json',
			}
		};

		return await request('get', `${this.url}/guilds/${guildId}/members/${userId}`, config);
	}

	async getGuildRoles(guildId: string) {
		const config = {
			headers: {
				Authorization: `Bot ${this.authToken}`,
				'Content-Type': 'application/json',
			}
		};

		return await request('get', `${this.url}/guilds/${guildId}/roles`, config);
	}

	async getUserDiscordInfo(userDicordId: number) {
		const result = await this.getRecipientInfo(userDicordId);

		console.log(result);
	}

	async sendDMMessage(userId: number, message: string) {
		const recipient = await this.getRecipientInfo(userId);
		const config = {
			headers: {
				Authorization: `Bot ${this.authToken}`,
				'Content-Type': 'application/json',
			}
		};

		await request('post', `${this.url}/channels/${recipient.id}/messages`, config, { content: message });
	}

	async fetchByUserId(user_id: number): Promise<DiscordUserInterface | null> {
		if (!user_id) throw Error(getErrorMessage('missingField', 'user_id de usuario (fetchByUserId DiscordService)'));

		const discordInfo = await this.database.fetchByUserId(user_id);

		if(discordInfo?.id) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			const userGuildData = await this.getUserGuildData(env.DISCORD_SERVER_ID, discordInfo.id as any);
			console.log(userGuildData);
			const guildRoles = await this.getGuildRoles(env.DISCORD_SERVER_ID);
			
			if(userGuildData?.roles) {
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const userRoles = userGuildData.roles.reduce((acc: Array<any>, roleId: string) => {
					// eslint-disable-next-line @typescript-eslint/no-explicit-any
					const roleInfo = guildRoles.find(((role: any) => {
						return role.id === roleId;
					}));

					acc.push({ id: roleId, name: roleInfo.name });
					return acc;
				}, []);

				discordInfo.roles = userRoles;
			}
		}
		return discordInfo;
	}

	//DATABASE
	async create(data: DiscordUserInterface): Promise<number> {
		if (!data?.discord_id) throw Error(getErrorMessage('missingField', 'discord_id (create DiscordService)'));
		if (!data?.user_id) throw Error(getErrorMessage('missingField', 'discord_id (create DiscordService)'));

		const insertData: DiscordUserInterface = {
			discord_id: data.discord_id,
			discord_email: data?.discord_email || '',
			discord_name: data?.discord_name || '',
			discord_avatar: data?.discord_avatar || '',
			discord_global_name: data?.discord_global_name || '',
			discord_guilda_roles: data?.discord_guilda_roles || '',
			discord_banner_color: data?.discord_banner_color || '',
		
			user_id: data.user_id
		};

		if(data?.discord_joined_at_guilda) insertData.discord_joined_at_guilda = data?.discord_joined_at_guilda;

		console.log({ insertData });

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}

	async removeByUser(id: number): Promise<void> {
		await this.database.deleteByUser(id);
	}
}

export default DiscordService;
