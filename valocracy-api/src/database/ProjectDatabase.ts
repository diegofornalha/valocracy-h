/* eslint-disable @typescript-eslint/no-explicit-any */
import { createBindParams } from '@/helpers/util';
import { ProjectInsertInterface, ProjectInterface } from '@/interfaces/ProjectInterface';
import Database from './Database';

class ProjectDatabase extends Database {
	constructor() { super(); }

	async fetch(id: number): Promise<ProjectInterface | null> {
		const rows: any = await this.query('SELECT * FROM project WHERE id = ?;', [id]);

		return rows[0]?.length > 0 ? rows[0][0] as ProjectInterface : null;
	}

	async fetchByUserAccount(id: number): Promise<Array<ProjectInterface>> {
		const rows: any = await this.query('SELECT * FROM project WHERE user_account_id = ?;', [id]);

		return rows[0] as Array<ProjectInterface>;
	}

	async fetchAllOfUser(id: number): Promise<Array<ProjectInterface>> {
		const rows = await this.query('SELECT * FROM project WHERE user_account_id = ?;', [id]);

		return rows[0] as Array<ProjectInterface>;
	}

	async fetchByOrganizationId(organizationId: string): Promise<Array<ProjectInterface>> {
		const rows = await this.query('SELECT * FROM project WHERE organization_id = ?;', [organizationId]);

		return rows[0] as Array<ProjectInterface>;
	}

	async fetchByOrganizationIdNApiKey(organizationId: string, apiKey: string): Promise<Array<ProjectInterface>> {
		const rows = await this.query('SELECT * FROM project WHERE organization_id = ? AND api_key = ?;', [organizationId, apiKey]);

		return rows[0] as Array<ProjectInterface>;
	}

	async create(userData: ProjectInsertInterface) {
		return await this.query('INSERT project (name, organization_id, api_key, user_account_id, reg_date) values (?, ?, ?, ?, now());', Object.values(userData));
	}

	async update(data: any, id: number) {
		const mysqlBind = createBindParams(data);

		return await this.query(`UPDATE project SET ${mysqlBind}, update_date = now() WHERE id = ?;`, [...Object.values(data), id]);
	}

	async remove(id: number) {
		return await this.query('DELETE FROM project WHERE id = ?;', [id]);
	}

	async removeByUserAcc(id: number) {
		return await (await this.getConnection()).query('DELETE FROM project WHERE user_account_id = ?;', [id]);
	}
}

export default ProjectDatabase;
