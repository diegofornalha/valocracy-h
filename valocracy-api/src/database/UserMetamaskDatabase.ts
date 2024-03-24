/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { UserMetamaskInterface } from '@/interfaces/UserMetamaskInterface';

class UserMetamaskDatabase extends Database {

	async fetch(id: number): Promise<UserMetamaskInterface | null> {
		const rows: any = await this.query('SELECT * FROM user_metamask WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as UserMetamaskInterface : null;
	}

	async fetchByAddress(address: string): Promise<UserMetamaskInterface | null> {
		const rows: any = await this.query('SELECT * FROM user_metamask WHERE address = ?;', [address]);

		return rows[0]?.length > 0 ? rows[0][0] as UserMetamaskInterface : null;
	}

	async fetchByUserAccount(id: number): Promise<Array<UserMetamaskInterface>> {
		const rows: any = await this.query('SELECT * FROM user_metamask WHERE user_account_id = ?;', [id]);

		return rows[0];
	}

	async create(data: UserMetamaskInterface) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO user_metamask SET ${mysqlBind};`, Object.values(data));
	}

	async update(data: UserMetamaskInterface, id: number) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`UPDATE user_metamask SET ${mysqlBind} WHERE id = ?;`, [...Object.values(data), id]);
	}

	async deleteByUser(id: number) {
		return await this.query('DELETE FROM user_metamask WHERE user_account_id = ?;', [id]);
	}
}

export default UserMetamaskDatabase;
