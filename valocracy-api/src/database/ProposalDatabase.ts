/* eslint-disable @typescript-eslint/no-explicit-any */
import { Proposal } from '@/interfaces/ProposalInterface';
import Database from './Database';
import { createBindParams } from '@/helpers/util';
import { ProposalVoteEnum } from '@/enums/ProposalVoteEnum';

export default class ProposalDatabase extends Database {
	async fetchVoteTotalPower(proposalId: number, vote: ProposalVoteEnum): Promise<number> {
		const rows: any = await this.query(`
            SELECT 
				SUM(t2.user_power) AS total_power
            FROM proposal t1 
                INNER JOIN vote t2 ON t2.proposal_id = t1.id
			WHERE t1.id = ? AND t2.answer = ?;`, [proposalId, vote]);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async fetch(id: number): Promise<Proposal | null> {
		const rows: any = await this.query(`
			SELECT * FROM proposal WHERE id = ?;`, [id]);

		return rows[0]?.length > 0 ? rows[0][0] as Proposal : null;
	}

	async fetchByProposalAndUser(id: number, userId: number): Promise<Proposal | null> {
		const rows: any = await this.query(`
			SELECT 
				t1.*,
				t2.answer
			FROM proposal t1
				LEFT JOIN vote t2 ON t2.proposal_id = t1.id AND t2.user_account_id = ?
			WHERE t1.id = ?;`, [userId, id]);

		return rows[0]?.length > 0 ? rows[0][0] as Proposal : null;
	}

	async fetchProposalUsersAnswer(id: number): Promise<Array<Proposal>> {
		const rows: any = await this.query(`
			SELECT 
				t2.answer,
				t3.username,
				t4.relative_power
			FROM proposal t1
				LEFT JOIN vote t2 ON t2.proposal_id = t1.id
				LEFT JOIN user_account t3 ON t3.id = t2.user_account_id
				LEFT JOIN proposal_user_power t4 ON t4.proposal_id = t1.id AND t3.id = t4.user_account_id
			WHERE t1.id = ?;`, [id]);

		return rows[0];
	}

	async fetchAll(): Promise<Array<Proposal>> {
		const rows: any = await this.query('SELECT * FROM proposal ORDER BY id DESC;', []);

		return rows[0];
	}

	async fetchAllAndUserVote(userAccountId: number): Promise<Array<Proposal>> {
		const rows: any = await this.query(`
			SELECT 
				t1.*,
				t2.answer,
				t3.power AS user_power
			FROM proposal t1
				LEFT JOIN vote t2 ON t2.proposal_id = t1.id AND t2.user_account_id = ?
				LEFT JOIN proposal_user_power t3 ON t3.proposal_id = t1.id AND t3.user_account_id = ?
			ORDER BY t1.id DESC;`, [userAccountId, userAccountId]);

		return rows[0];
	}

	async fetchVotedQuorum(proposalId: number): Promise<number> {
		const rows: any = await this.query(`
            SELECT 
                SUM(t2.user_power) AS total_power 
            FROM proposal t1 
                INNER JOIN vote t2 ON t2.proposal_id = t1.id
			WHERE t1.id = ?;`, [proposalId]);

		return rows[0]?.length > 0 ? rows[0][0]['total_power'] : 0;
	}

	async create(data: Proposal) {
		const mysqlBind = createBindParams(data as any);

		return await this.query(`INSERT INTO proposal SET ${mysqlBind};`, Object.values(data));
	}

	async update(data: any, id: number) {
		const mysqlBind = createBindParams(data);

		return await this.query(`UPDATE proposal SET ${mysqlBind} WHERE id = ?;`, [...Object.values(data), id]);
	}

}