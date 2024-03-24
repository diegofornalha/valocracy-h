/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import { Logger } from '../services/LoggerService';
import moment from 'moment-timezone';
import CryptoJS from 'crypto-js';

const getDateNow = (): string => {
	return moment().format('YYYY-MM-DD');
};

const getDatetimeNow = (): string => {
	return moment().format('YYYY-MM-DDTh:mm:ss');
};

const encryptAES = (data: any, env: any): string => {
	const cfg: any = { iv: CryptoJS.enc.Base64.parse(env.SECRET_SALT) };
	const secret = CryptoJS.enc.Base64.parse(env.SECRET);

	return CryptoJS.AES.encrypt(data, secret, cfg).toString();
};

const decryptAES = (data: any, env: any) => {
	const cfg: any = { iv: CryptoJS.enc.Base64.parse(env.SECRET_SALT) };
	const secret = CryptoJS.enc.Base64.parse(env.SECRET);

	return CryptoJS.AES.decrypt(data, secret, cfg).toString(CryptoJS.enc.Utf8);
};

const createBindParams = (fields: Array<any>) => {
	let result: string = '';

	for (const key in fields) {
		const value = fields[key];

		result += `${key} ${value != null ? '= ?' : '= NULL'}, `;
	}
	return result.slice(0, -2);
};

const maskEmail = (email: string) => {
	const emailInParts = email.split('@');
	const emailPersonDemain = emailInParts[0];

	return `${emailPersonDemain[0]}${emailPersonDemain[1]}**${emailPersonDemain[emailPersonDemain.length - 1]}@${emailInParts[1]}`;
};

async function request(method: string, url: string, config: any, data: any = null, errorHandler: any = null) {
	const request = async () => {
		if (method === 'get') {
			return await axios.get(`${url}`, config).catch((res: any) => res.response);
		} else if (method === 'post') {
			return await axios.post(`${url}`, data, config).catch((res: any) => res.response);
		} else if (method === 'put') {
			return await axios.put(`${url}`, data, config).catch((res: any) => res.response);
		} else if (method === 'delete') {
			return await axios.delete(`${url}`, config).catch((res: any) => res.response);
		}
	};

	const result = await request();

	if (result?.status !== 200 || (result.data?.status != undefined && result.data?.status !== 200)) {
		const message = result?.data?.message || result?.data?.error_description;

		Logger.getInstance().error('AxiosRequest', message);
		if (errorHandler != null) errorHandler(message);
		else throw Error(message);
	}

	return result.data;
}

function sleep(ms: number) {
	return new Promise((resolve) => {
		setTimeout(resolve, ms);
	});
}

function percentOf(x: number, y: number): number {
	const percent: number = x / y * 100;

	return Number(percent.toFixed(2));
}

export {
	getDateNow,
	getDatetimeNow,
	encryptAES,
	decryptAES,
	createBindParams,
	maskEmail,
	request,
	sleep,
	percentOf
};