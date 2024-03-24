/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { Effort,EffortHash } from '@/interfaces/EffortInterface';

class EffortDatabase extends Database {

	private async fetchLastInsertId(userAccountId: number): Promise<string> {
		const rows: any = await this.query('SELECT id FROM effort WHERE user_account_id = ? ORDER BY reg_date DESC LIMIT 1;', [userAccountId]);

		return rows[0]?.length > 0 ? rows[0][0]['id'] : null;
	}

	async fetch(id: string): Promise<Effort | null> {
		const rows: any = await this.query(`
			SELECT 
				t1.id,
				t1.title,
				t1.subtitle,
				t1.text,
				t1.image_url,
				t1.is_claimed,
				t1.claim_date,
				t1.claimed_balance,
				t1.mint_transaction_hash,
				t1.claim_transaction_hash,
				t1.user_account_id,
				t2.weight as rarity_weight,
				t2.name as rarity_name,
				t2.weight as rarity_weight,
				t3.name as nature_name
			FROM effort t1
				INNER JOIN effort_rarity t2 ON t2.id = t1.effort_rarity_id
				INNER JOIN effort_rarity t3 ON t3.id = t1.effort_nature_id
			WHERE t1.id = ?;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0] as Effort : null;
	}

	async fetchByUser(id: number): Promise<Array<Effort>> {
		const rows: any = await this.query('SELECT * FROM effort WHERE user_account_id = ?;', [id]);

		return rows[0];
	}

	async fetchUnclaimedByUser(id: number): Promise<Array<Effort>> {
		const rows: any = await this.query('SELECT * FROM effort WHERE is_claimed = 0 AND user_account_id = ?;', [id]);

		return rows[0];
	}

	async fetchTotalEconomicPower(): Promise<number> {
		const rows: any = await this.query(`
			SELECT 
				SUM(t2.weight) AS total_power
			FROM valocracia.effort t1
				INNER JOIN effort_rarity t2 ON t2.id = t1.effort_rarity_id
			WHERE t1.is_claimed = 0;`);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async fetchEconomicPowerOfUser(userAccountId: number): Promise<number> {
		const rows: any = await this.query(`
			SELECT 
				SUM(t2.weight) AS total_power
			FROM valocracia.effort t1
				INNER JOIN effort_rarity t2 ON t2.id = t1.effort_rarity_id
			WHERE t1.user_account_id = ? AND t1.is_claimed = 0;`, [userAccountId]);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async fetchEconomicPowerOfEffort(id: string): Promise<number> {
		const rows: any = await this.query(`
			SELECT 
				t2.weight AS total_power
			FROM valocracia.effort t1
				INNER JOIN effort_rarity t2 ON t2.id = t1.effort_rarity_id
			WHERE t1.id = ? AND t1.is_claimed = 0;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async fetchTotalGovernancePower(): Promise<number> {
		const rows: any = await this.query(`
			SELECT 
				SUM(t2.weight) AS total_power
			FROM valocracia.effort t1
				INNER JOIN effort_rarity t2 ON t2.id = t1.effort_rarity_id;`);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async fetchGovernancePowerOfUser(userAccountId: number): Promise<number> {
		const rows: any = await this.query(`
			SELECT 
				SUM(t2.weight) AS total_power
			FROM valocracia.effort t1
				INNER JOIN effort_rarity t2 ON t2.id = t1.effort_rarity_id
			WHERE t1.user_account_id = ?;`, [userAccountId]);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async fetchGovernancePowerOfEffort(id: string): Promise<number> {
		const rows: any = await this.query(`
			SELECT 
				SUM(t2.weight) AS total_power
			FROM valocracia.effort t1
				INNER JOIN effort_rarity t2 ON t2.id = t1.effort_rarity_id
			WHERE t1.id = ?;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async create(data: Effort) {
		const mysqlBind = createBindParams(data as any);

		await this.query(`INSERT INTO effort SET ${mysqlBind};`, Object.values(data));
		return this.fetchLastInsertId(data.user_account_id);
	}

	async update(data: Effort | EffortHash, id: string) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`UPDATE effort SET ${mysqlBind} WHERE id = ?;`, [...Object.values(data), id]);
	}
}

export default EffortDatabase;