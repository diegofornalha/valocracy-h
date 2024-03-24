import EffortNatureDatabase from '@/database/EffortNatureDatabase';
import { getErrorMessage } from '@/helpers/response_collection';
import { EffortNature } from '@/interfaces/EffortNatureInterface';

class EffortNatureService {
	private database: EffortNatureDatabase;

	constructor() {
		this.database = new EffortNatureDatabase();
	}

	async fetch(id: number): Promise<EffortNature | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da natureza do esforço'));

		return await this.database.fetch(id);
	}

	async fetchAll(): Promise<Array<EffortNature>> {
		return await this.database.fetchAll();
	}


	async create(data: EffortNature): Promise<number> {
		if (!data.name) throw Error(getErrorMessage('missingField', 'Nome da raridade'));
		if (!data.image_url) throw Error(getErrorMessage('missingField', 'URL da imagem'));

		const insertData: EffortNature = {
			name: data.name,
			image_url: data.image_url
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}
}

export default EffortNatureService;