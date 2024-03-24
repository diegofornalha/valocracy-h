import HotmartAccountDatabase from '@/database/HotmartAccountDatabase';
import { getErrorMessage } from '@/helpers/response_collection';
import { HotmartAccountInterface, HotmartAccountUpdateInterface } from '@/interfaces/HotmartAccountInterface';
import ExternalAccessService from './ExternalAccessService';
import UserService from './UserService';

class HotmartAccountService {
	private database: HotmartAccountDatabase;

	constructor() {
		this.database = new HotmartAccountDatabase();
	}

	async getActiveEmail(email: string, userAccountId: number): Promise<Array<HotmartAccountInterface>> {
		if (!email) throw Error(getErrorMessage('missingField', 'Email'));

		const userService = new UserService();

		const user = await userService.fetch(userAccountId);
		const accountData = !user?.ignore_original_hotmart_account ? await this.database.getActiveEmail(email) : [];
		if (accountData.length === 0) {
			const externalAccessService = new ExternalAccessService();
			const extraEmails = await externalAccessService.fetchByUser(userAccountId);

			if (extraEmails.length > 0) return await this.database.getActiveEmail(extraEmails[0].email);
			else return [];
		} else {
			return accountData;
		}
	}

	async isEmailActiveInList(email: string): Promise<boolean> {
		if (!email) throw Error(getErrorMessage('missingField', 'Email'));

		const accountData = await this.database.isEmailActiveInList(email);

		return Boolean(accountData);
	}

	async fetchByEmail(email: string): Promise<HotmartAccountInterface | null> {
		if (!email) throw Error(getErrorMessage('missingField', 'Email'));

		return await this.database.fetchByEmail(email);
	}

	async fetchAll(): Promise<Array<HotmartAccountInterface>> {
		return await this.database.fetchAll();
	}


	async update(data: HotmartAccountInterface, hotmartId: string) {
		const toUpdate: HotmartAccountUpdateInterface = {

		};

		if (data?.plan_adherence) toUpdate.plan_adherence = data.plan_adherence;
		if (data?.last_payment) toUpdate.last_payment = data.last_payment;
		if (data?.due_date) toUpdate.due_date = data.due_date;
		if (typeof data?.phone === 'string') toUpdate.phone = data.phone;

		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.update(toUpdate, hotmartId);
	}
}

export default HotmartAccountService;
