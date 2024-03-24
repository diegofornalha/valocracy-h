/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { EffortNature } from '@/interfaces/EffortNatureInterface';

class EffortNatureDatabase extends Database {

	async fetch(id: number): Promise<EffortNature | null> {
		const rows: any = await this.query(`
			SELECT * FROM effort_nature WHERE id = ?;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0] as EffortNature : null;
	}

	async fetchAll(): Promise<Array<EffortNature>> {
		const rows: any = await this.query('SELECT * FROM effort_nature;', []);

		return rows[0];
	}

	async create(data: EffortNature) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO effort_nature SET ${mysqlBind};`, Object.values(data));
	}
}

export default EffortNatureDatabase;