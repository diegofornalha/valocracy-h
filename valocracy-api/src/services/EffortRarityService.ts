import EffortRarityDatabase from '@/database/EffortRarityDatabase';
import { getErrorMessage } from '@/helpers/response_collection';
import { EffortRarity } from '@/interfaces/EffortRarityInterface';

class EffortRarityService {
	private database: EffortRarityDatabase;

	constructor() {
		this.database = new EffortRarityDatabase();
	}

	async fetch(id: number): Promise<EffortRarity | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id da raridade do esforço'));

		return await this.database.fetch(id);
	}

	async fetchAll(): Promise<Array<EffortRarity>> {
		return await this.database.fetchAll();
	}


	async create(data: EffortRarity): Promise<number> {
		if (!data.name) throw Error(getErrorMessage('missingField', 'Nome da raridade'));
		if (!data.weight) throw Error(getErrorMessage('missingField', 'Peso da raridade'));
		if (!data.image_url) throw Error(getErrorMessage('missingField', 'URL da imagem'));

		const insertData: EffortRarity = {
			name: data.name,
			weight: data.weight,
			image_url: data.image_url
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}
}

export default EffortRarityService;