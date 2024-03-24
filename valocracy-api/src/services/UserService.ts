import { UserAccountInterface, UserAccountUpdateInterface } from '@/interfaces/UserAccountInterface';
import { getErrorMessage } from '@/helpers/response_collection';
import md5 from 'js-md5';
import MailCodeService from './MailCodeService';
import UserDatabase from '@/database/UserDatabase';

class UserService {
	private database: UserDatabase;

	constructor() {
		this.database = new UserDatabase();
	}

	async fetch(id: number): Promise<UserAccountInterface | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id de usuario'));

		return await this.database.fetch(id);
	}

	async fetchAll(): Promise<Array<UserAccountInterface>> {
		return await this.database.fetchAll();
	}

	async fetchForFront(id: number): Promise<UserAccountInterface | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id de usuario'));

		return await this.database.fetchForFront(id);
	}

	async fetchForAlertByIds(ids: Array<number>): Promise<Array<UserAccountInterface>> {
		if (ids.length === 0) throw Error(getErrorMessage('missingField', 'Ids dos usuarios'));

		return await this.database.fetchForAlertByIds(ids);
	}

	async fetchByUsername(username: string): Promise<UserAccountInterface> {
		if (!username) throw Error(getErrorMessage('missingField', 'Nome de usuario'));

		const user = await this.database.fetchByUsername(username);

		if (user.length > 0) return user[0];
		else return {};
	}

	async fetchByEmail(email: string): Promise<UserAccountInterface | null> {
		if (!email) throw Error(getErrorMessage('missingField', 'Email'));

		return await this.database.fetchByEmail(email);
	}

	async fetchUsersPhones(): Promise<Array<UserAccountInterface>> {
		return this.database.fetchUsersPhones();
	}

	async fetchUsersPhonesFromRegDate(regDate: string): Promise<Array<UserAccountInterface>> {
		return this.database.fetchUsersPhonesFromRegDate(regDate);
	}

	async fetchIsUsernameUnique(username: string): Promise<boolean> {
		if (username.length === 0) throw Error(getErrorMessage('missingField', 'Nome do usuario'));

		const user = await this.database.fetchIfUsernameExist(username);

		return user === null;
	}

	async fetchByPhone(phone: string): Promise<UserAccountInterface> {
		if (!phone) throw Error(getErrorMessage('missingField', 'Telefone do usuario'));

		const user = await this.database.fetchByPhone(phone);

		if (user.length > 0) return user[0];
		else return {};
	}

	async fetchUserByUsernameNPassword(data: UserAccountInterface) {
		if (!data.username) throw Error(getErrorMessage('missingField', 'Nome de usuario'));
		if (!data.password) throw Error(getErrorMessage('missingField', 'Senha'));
		data.password = md5(data.password);
		return await this.database.fetchUserByUsernameNPassword(data.username, data.password);
	}

	async create(userData: UserAccountInterface): Promise<number> {
		if (!userData.username) throw Error(getErrorMessage('missingField', 'Nome de usuario'));
		if (!userData.email) throw Error(getErrorMessage('missingField', 'Email'));
		
		const userByUsername = await this.fetchByUsername(userData.username);

		if (Object.keys(userByUsername).length > 0) throw Error(getErrorMessage('userAlreadyExist'));

		const insertData: UserAccountInterface = {
			username: userData.username,
			email: userData.email,
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}

	async update(data: UserAccountUpdateInterface, id: number) {
		const mailCodeService = new MailCodeService();
		const toUpdate: UserAccountInterface = {

		};

		if (data?.username) {
			const user: UserAccountInterface = await this.fetchByUsername(data.username);

			if (Object.keys(user).length > 0) throw Error(getErrorMessage('userAlreadyExist'));

			toUpdate.username = data.username;
		}
		if (data?.full_name) toUpdate.full_name = data.full_name;
		if (data?.email) {
			if (!data?.email_validation) throw Error(getErrorMessage('missingValidationCodeData'));
			await mailCodeService.validateEmailCode(data.email_validation?.id, data.email_validation?.code);
			const userByEmail = await this.database.fetchByEmail(data.email);

			if (userByEmail) throw Error(getErrorMessage('userAlreadyExist'));
			toUpdate.email = data.email;
		}
		if(data?.ignore_original_hotmart_account !== undefined) toUpdate.ignore_original_hotmart_account = data.ignore_original_hotmart_account;

		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.update(toUpdate, id);
	}

	async updateDiscordId(discordId: string, id: number) {
		const toUpdate: UserAccountInterface = {

		};

		toUpdate.discord_id = discordId;

		await this.database.update(toUpdate, id);
	}

	async remove(id: number): Promise<void> {
		await this.database.delete(id);
	}
}

export default UserService;
