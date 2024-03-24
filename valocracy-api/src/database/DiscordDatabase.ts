/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import Database from './Database';
import { DiscordUserInterface } from '@/interfaces/DiscordInterface';

class DiscordDatabase extends Database {

	async fetchByUserId(user_id: number): Promise<DiscordUserInterface | null> {
		const rows: any = await this.query(
			`SELECT 
            
            id AS user_discord_id,
            discord_id AS id,
            discord_name AS name,
            discord_global_name AS global_name,
            discord_email AS email,
            discord_avatar AS avatar,
            discord_banner_color AS banner_color,
            discord_guilda_roles AS guilda_roles,
            discord_joined_at_guilda AS joined_at_guilda
            FROM user_discord WHERE user_id = ?`,
			[user_id]);

		return rows[0]?.length > 0 ? rows[0][0] as DiscordUserInterface : null;
	}


	async create(data: DiscordUserInterface) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO user_discord SET ${mysqlBind};`, Object.values(data));
	}

	async update(data: DiscordUserInterface, id: number) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`UPDATE user_discord SET ${mysqlBind}, update_date = now() WHERE id = ?;`, [...Object.values(data), id]);
	}

	async delete(id: number) {
		return await this.query('DELETE FROM user_discord WHERE id = ?;', [id]);
	}

	async deleteByUser(id: number) {
		return await this.query('DELETE FROM user_discord WHERE user_id = ?;', [id]);
	}
}

export default DiscordDatabase;