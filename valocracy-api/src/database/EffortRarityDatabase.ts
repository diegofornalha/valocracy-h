/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { EffortRarity } from '@/interfaces/EffortRarityInterface';

class EffortRarityDatabase extends Database {

	async fetch(id: number): Promise<EffortRarity | null> {
		const rows: any = await this.query(`
			SELECT * FROM effort_rarity WHERE id = ?;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0] as EffortRarity : null;
	}

	async fetchAll(): Promise<Array<EffortRarity>> {
		const rows: any = await this.query('SELECT * FROM effort_rarity;', []);

		return rows[0];
	}

	async create(data: EffortRarity) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO effort_rarity SET ${mysqlBind};`, Object.values(data));
	}
}

export default EffortRarityDatabase;
