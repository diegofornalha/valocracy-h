import axios, { AxiosInstance } from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import env from '@/config';
import { getErrorMessage } from '@/helpers/response_collection';
import PinataPinInterface from '@/interfaces/PinataPinInterface';
import ValocracyNFTJSONInterface from '@/interfaces/ValocracyNFTJSONInterface';
import PinNFTDataInterface from '@/interfaces/PinNFTDataInterface';
import { Blob } from 'node:buffer';

const { PINATA_BASE_URI, PINATA_TOKEN } = env;

class PinataService {
	private api: AxiosInstance;

	constructor() {
		this.api = axios.create({
			baseURL: PINATA_BASE_URI,
			headers: {
				Authorization: `Bearer ${PINATA_TOKEN}`,
			},
		});
	}

	private async pintFile(formData: FormData): Promise<PinataPinInterface> {
		const res = await this.api.post('pinning/pinFileToIPFS', formData, {
			headers: {
				'Content-Type': 'multipart/form-data;',
			},
		});

		return res.data;
	}

	async pinImage(fileData: PinNFTDataInterface){
		const formData: FormData = new FormData();
		const { src, name, image_extension } = fileData;

		const file = fs.createReadStream(src);
		formData.append('file', file, `${name}.${image_extension}`);

		const pinataImageMetadata = JSON.stringify({
			name: name
		});
		formData.append('pinataImageMetadata', pinataImageMetadata);

		const pinataOptions = JSON.stringify({
			cidVersion: 0,
		});
		formData.append('pinataOptions', pinataOptions);

		const pinImageResult: PinataPinInterface = await this.pintFile(formData);

		return pinImageResult.IpfsHash;
	}

	async pinNFT(nftData: PinNFTDataInterface) {
		try {
			const imageIPFSHash = await this.pinImage(nftData);

			const formData: FormData = new FormData();
			const { id, name, rarity, nature } = nftData;
			const image = `https://yellow-quickest-salmon-828.mypinata.cloud/ipfs/${imageIPFSHash}`;
			const nftJsonToIPFS: ValocracyNFTJSONInterface = {
				id,
				name,
				image,
				attributes: [
					{
						trait_type: 'rarity',
						value: rarity
					},
					{
						trait_type: 'nature',
						value: nature
					}
				]
			};
			const nftJsonBlob: Blob = new Blob([JSON.stringify(nftJsonToIPFS)], { type: 'application/json' });
			// const nftJsonBlob: Blob = new Blob([JSON.stringify(nftJsonToIPFS)], { type: 'text/plain' });
			const buffer = Buffer.from(await nftJsonBlob.arrayBuffer());

			formData.append('file', buffer, `${name}.json`);
			const pinataMetadata = JSON.stringify({
				name: `${name}.json`
			});
			formData.append('pinataMetadata', pinataMetadata);
	
			const pinNFTJsonResult = await this.pintFile(formData);

			return { json_data: `https://ipfs.io/ipfs/${pinNFTJsonResult.IpfsHash}`, image: image };
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			console.log(error);
			throw Error(getErrorMessage('IPFSServiceError', error.message));
		}
	}
}

export default new PinataService();
