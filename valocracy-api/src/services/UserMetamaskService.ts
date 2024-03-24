import UserMetamaskDatabase from '@/database/UserMetamaskDatabase';
import { getErrorMessage } from '@/helpers/response_collection';
import { UserMetamaskInterface } from '@/interfaces/UserMetamaskInterface';

class UserMetamaskService {
	private database: UserMetamaskDatabase;

	constructor() {
		this.database = new UserMetamaskDatabase();
	}

	async fetch(id: number): Promise<UserMetamaskInterface | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da carteira'));

		return await this.database.fetch(id);
	}

	async fetchByAddress(address: string): Promise<UserMetamaskInterface | null> {
		if (!address) throw Error(getErrorMessage('missingField', 'Endereço da carteira'));

		return await this.database.fetchByAddress(address);
	}

	async fetchByUserAccount(id: number): Promise<Array<UserMetamaskInterface>> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da conta do usuario'));

		return await this.database.fetchByUserAccount(id);
	}

	async isUserOwnerOfAddress(address: string, userId: number): Promise<boolean> {
		const wallet: UserMetamaskInterface | null = await this.fetchByAddress(address);
		if (!wallet) {
			throw Error(getErrorMessage('walletNotFound'));
		} else {
			return wallet.user_account_id === userId;
		}
	}

	async create(data: UserMetamaskInterface): Promise<number> {
		if (!data.address) throw Error(getErrorMessage('missingField', 'Endereço da carteira'));
		if (!data.user_account_id) throw Error(getErrorMessage('missingField', 'Id da conta do usuario'));

		const insertData: UserMetamaskInterface = {
			address: data.address,
			user_account_id: data.user_account_id
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}

	async update(data: UserMetamaskInterface, id: number) {
		const toUpdate: UserMetamaskInterface = {

		};

		if (data?.address) toUpdate.address = data.address;
		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.update(toUpdate, id);
	}

	async removeByUser(id: number): Promise<void> {
		await this.database.deleteByUser(id);
	}
}

export default UserMetamaskService;
