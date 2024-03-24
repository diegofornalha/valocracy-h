/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { ExternalAccessInterface } from '@/interfaces/ExternalAccessInterface';

class ExternalAccessDatabase extends Database {
	constructor() {
		super();
	}

	async fetchByUserAccount(id: number): Promise<Array<ExternalAccessInterface>> {
		const rows = await this.query('SELECT * FROM external_access WHERE user_account_id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0] as Array<ExternalAccessInterface> : [];
	}

	async fetchByEmail(email: string): Promise<Array<ExternalAccessInterface>> {
		const rows= await this.query('SELECT * FROM external_access WHERE email = ?;', [email]);

		return rows[0]?.length > 0 ? rows[0] as Array<ExternalAccessInterface> : [];
	}

	async create(data: any) {
		const mysqlBind = createBindParams(data);

		return await this.query(`INSERT external_access SET ${mysqlBind};`, Object.values(data));
	}

	async deleteByUser(id: number) {
		return await this.query('DELETE FROM external_access WHERE user_account_id = ?;', [id]);
	}
}

export default ExternalAccessDatabase;
