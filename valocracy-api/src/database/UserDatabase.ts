/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserAccountInterface } from '@/interfaces/UserAccountInterface';
import { createBindParams } from '@/helpers/util';
import Database from './Database';

class UserDatabase extends Database {

	async fetchForFront(id: number): Promise<UserAccountInterface | null> {
		const rows: any = await this.query(`
			SELECT
				id,
				full_name,
				username,
				email,
				phone,
				ignore_original_hotmart_account
			FROM user_account 
			WHERE id = ?;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0] as UserAccountInterface : null;
	}

	async fetch(id: number): Promise<UserAccountInterface | null> {
		const rows: any = await this.query('SELECT *, CAST(DATE(reg_date) AS CHAR) AS reg_date_date  FROM user_account WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as UserAccountInterface : null;
	}

	async fetchAll(): Promise<Array<UserAccountInterface>> {
		const rows: any = await this.query('SELECT id, username  FROM user_account;', []);

		return rows[0];
	}

	async fetchUsersPhones(): Promise<Array<any>> {
		const rows: any = await this.query(`
            SELECT
                phone
            FROM user_account WHERE phone IS NOT NULL;`, []);

		return rows[0];
	}

	async fetchUsersPhonesFromRegDate(regDate: string): Promise<Array<any>> {
		const rows: any = await this.query(`
            SELECT
                phone
            FROM user_account WHERE phone IS NOT NULL AND reg_date >= ?;`, [regDate]);

		return rows[0];
	}

	async fetchForAlertByIds(ids: Array<number>): Promise<Array<UserAccountInterface>> {
		const idsWhere = `t1.id = ${ids.join(' OR t1.id = ')}`;
		const rows: any = await this.query(`
            SELECT 
                t1.id,
                t1.username,
                t1.phone,
                t1.email,
                t1.discord_id,
                t2.use_discord,
                t2.use_whatsapp,
                t2.use_telegram
            FROM user_account t1
                INNER JOIN user_alert_config t2 ON t2.user_account_id = t1.id
            WHERE ${idsWhere};`);

		return rows[0] as Array<UserAccountInterface>;
	}

	async fetchIfUsernameExist(username: string): Promise<UserAccountInterface | null> {
		const rows: any = await this.query('SELECT * FROM user_account WHERE username = ?;', [username]);

		return rows[0]?.length > 0 ? rows[0][0] as UserAccountInterface : null;
	}

	async fetchByPhone(phone: string): Promise<Array<UserAccountInterface>> {
		const rows = await this.query('SELECT * FROM user_account WHERE phone = ?;', [phone]);

		return rows[0] as Array<UserAccountInterface>;
	}

	async fetchByUsername(username: string): Promise<Array<UserAccountInterface>> {
		const rows = await this.query('SELECT * FROM user_account WHERE username = ?;', [username]);

		return rows[0] as Array<UserAccountInterface>;
	}

	async fetchByEmail(email: string): Promise<UserAccountInterface | null> {
		const rows: any = await this.query('SELECT * FROM user_account WHERE email = ?;', [email]);

		return rows[0]?.length > 0 ? rows[0][0] as UserAccountInterface : null;
	}

	async fetchUserByUsernameNPassword(username: string, password: string): Promise<Array<UserAccountInterface>> {
		const rows = await this.query('SELECT * FROM user_account WHERE username = ? AND password = ?;', [username, password]);

		return rows[0] as Array<UserAccountInterface>;
	}

	async create(data: UserAccountInterface) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO user_account SET ${mysqlBind};`, Object.values(data));
	}

	async update(data: any, id: number) {
		const mysqlBind = createBindParams(data);

		return await this.query(`UPDATE user_account SET ${mysqlBind}, update_date = now() WHERE id = ?;`, [...Object.values(data), id]);
	}

	async delete(id: number) {
		return await this.query('DELETE FROM user_account WHERE id = ?;', [id]);
	}
}

export default UserDatabase;
