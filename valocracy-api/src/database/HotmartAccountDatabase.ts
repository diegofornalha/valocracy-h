/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { HotmartAccountInterface, HotmartAccountUpdateInterface } from '@/interfaces/HotmartAccountInterface';

class HotmartAccountDatabase extends Database {
	constructor() { 
		super();
	}

	async getActiveEmail(email: string): Promise<Array<HotmartAccountInterface>> {
		const rows: any = await this.query(`
        SELECT 
			hotmart_id,
            status,
            name,
            email,
			CASE WHEN plan like '%Associate%' THEN 'Associate'
				 WHEN plan like '%Advancer%' THEN 'Advancer'
				 ELSE ''
			END AS  plan
        FROM subscriber WHERE email = ? AND status = 'ACTIVE';`, [email]);

		return rows[0]?.length > 0 ? rows[0] as Array<HotmartAccountInterface> : [];
	}

	async isEmailActiveInList(email: string): Promise<HotmartAccountInterface | null> {
		const rows: any = await this.query('SELECT * FROM subscriber WHERE email = ? AND status = \'ACTIVE\';', [email]);

		return rows[0]?.length > 0 ? rows[0][0] as HotmartAccountInterface : null;
	}

	async fetchAll(): Promise<Array<HotmartAccountInterface>> {
		const rows: any = await this.query(`
            SELECT 
                hotmart_id,
                status,
                name,
                email,
				plan,
				plan_adherence,
				last_payment,
				due_date,
				phone
            FROM subscriber;`, []);

		return rows[0];
	}

	async fetchByEmail(email: string): Promise<HotmartAccountInterface | null> {
		const rows: any = await this.query(`
            SELECT 
                hotmart_id,
                status,
                name,
                email
            FROM subscriber WHERE email = ?;`, [email]);

		return rows[0]?.length > 0 ? rows[0][0] as HotmartAccountInterface : null;
	}

	async update(data: HotmartAccountUpdateInterface, hotmartId: string) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`UPDATE subscriber SET ${mysqlBind} WHERE hotmart_id = ?;`, [...Object.values(data), hotmartId]);
	}
}

export default HotmartAccountDatabase;
