import { getErrorMessage } from '@/helpers/response_collection';
import { ProjectInterface, ProjectInsertInterface } from '@/interfaces/ProjectInterface';
import crypto from 'crypto';
import { encryptAES } from '@/helpers/util';
import env from '@/config';
import ProjectDatabase from '@/database/ProjectDatabase';

class ProjectService {
	private database: ProjectDatabase;

	constructor() {
		this.database = new ProjectDatabase();
	}

	async fetch(id: number): Promise<ProjectInterface | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id do projeto'));

		return await this.database.fetch(id);
	}

	async fetchByUserAccount(id: number): Promise<Array<ProjectInterface>> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da conta do usuario vinculado ao projeto'));

		return await this.database.fetchByUserAccount(id);
	}

	async fetchAllOfUser(id: number): Promise<Array<ProjectInterface>> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da conta do usuario para o projeto'));

		return await this.database.fetchAllOfUser(id);
	}

	async fetchByOrganizationIdNApiKey(data: ProjectInterface): Promise<Array<ProjectInterface>> {
		if (!data.organization_id) throw Error(getErrorMessage('missingField', 'Id da organizacao'));
		if (!data.api_key) throw Error(getErrorMessage('missingField', 'Api key'));
		
		data.organization_id = encryptAES(data.organization_id, env);
		data.api_key = encryptAES(data.api_key, env);

		return await this.database.fetchByOrganizationIdNApiKey(data.organization_id, data.api_key);
	}

	async create(data: ProjectInsertInterface): Promise<number> {
		const generateUniqueOrgId = async (): Promise<string> => {
			const newKey = encryptAES(Buffer.from(crypto.randomBytes(32)).toString('hex'), env);
			const project = await this.database.fetchByOrganizationId(newKey);
			
			if (project.length > 0) return generateUniqueOrgId();
			else return newKey;
		};
		if (!data.name) throw Error(getErrorMessage('missingField', 'Nome'));
		if (!data.user_account_id) throw Error(getErrorMessage('missingField', 'Id da conta'));
		
		const insertData: ProjectInsertInterface = {
			name: data.name,
			organization_id: await generateUniqueOrgId(), 
			api_key: encryptAES(Buffer.from(crypto.randomBytes(32)).toString('hex'), env),
			user_account_id: data.user_account_id
		};
		console.log(insertData);
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result:any = await this.database.create(insertData);
		return result[0].insertId;
	}

	async update(data: ProjectInterface, id: number) {
		const toUpdate: ProjectInterface = {

		};

		if (data.name) toUpdate.name = data.name;

		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.update(toUpdate, id);
	}

	async remove(id: number) {
		const project = await this.fetch(id);

		if(!project) throw Error(getErrorMessage('registryNotFound', 'Projeto'));

		await this.database.remove(id);
	}

	async removeByUserAcc(id: number) {
		await this.database.removeByUserAcc(id);
	}
}

export default ProjectService;
