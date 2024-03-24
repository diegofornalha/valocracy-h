/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { MailCodeInterface } from '@/interfaces/MailCodeInterface';

class MailCodeDatabase extends Database {
	
	constructor() {
		super();
	}

	async validateEmailCode(id: number, code: string): Promise<MailCodeInterface | null> {
		const rows: any = await this.query('SELECT * FROM mail_code WHERE id = ? AND code = ?;', [id, code]);

		return rows[0]?.length > 0 ? rows[0][0] as MailCodeInterface : null;
	}

	async fetch(id: number): Promise<MailCodeInterface | null> {
		const rows: any = await this.query('SELECT * FROM mail_code WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as MailCodeInterface : null;
	}

	async fetchLastByEmail(email: string): Promise<MailCodeInterface | null> {
		const rows: any = await this.query('SELECT * FROM mail_code WHERE email = ? ORDER BY id DESC;', [email]);

		return rows[0]?.length > 0 ? rows[0][0] as MailCodeInterface : null;
	}

	async create(data: MailCodeInterface) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO mail_code SET ${mysqlBind};`, Object.values(data));
	}

	async update(data: any, id: number) {
		const mysqlBind = createBindParams(data);

		return await this.query(`UPDATE mail_code SET ${mysqlBind}, update_date = now() WHERE id = ?;`, [...Object.values(data), id]);
	}
}

export default MailCodeDatabase;
