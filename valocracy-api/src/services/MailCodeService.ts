import MailCodeDatabase from '@/database/MailCodeDatabase';
import { getErrorMessage } from '@/helpers/response_collection';
import { MailCodeInterface } from '@/interfaces/MailCodeInterface';
import crypto from 'crypto';
import moment from 'moment-timezone';

class MailCodeService {
	private database: MailCodeDatabase;

	constructor() {
		this.database = new MailCodeDatabase();
	}

	async validateEmailCode(id: number, code: string) {
		const isValidEmailCode = await this.isValidEmailCode(id, code);
		if (!isValidEmailCode) throw Error(getErrorMessage('invalidEmailCode'));
	}

	async isValidEmailCode(id: number, code: string) {
		if (!id) throw Error(getErrorMessage('missingField', 'Id codigo de email'));
		if (!code) throw Error(getErrorMessage('missingField', 'Codigo de email'));

		const email = await this.database.validateEmailCode(id, code);
		if (email?.status != 'SND') {
			if (email?.status === 'EXP') throw Error(getErrorMessage('emailCodeExpired'));
			return false;
		}
		if (email) {
			const regDateIncremented = moment(email?.reg_date).add('5', 'minutes');
			const dateNow = moment().add(-3, 'hour');
			const isValidHours = dateNow.isBefore(regDateIncremented);

			if (!isValidHours) {
				this.update({ status: 'EXP' }, id);
				throw Error(getErrorMessage('emailCodeExpired'));
			}
		}

		return Boolean(email);
	}

	async getNewMailCode(email: string): Promise<MailCodeInterface> {
		const mailCodeId = await this.create({ email });
		const mailCode = await this.fetch(mailCodeId);

		if (!mailCode) throw Error(getErrorMessage('emailCreateError'));

		return mailCode;
	}

	async fetch(id: number): Promise<MailCodeInterface | null> {
		if (!id) throw Error(getErrorMessage('missingField', 'Id codigo de email'));

		return await this.database.fetch(id);
	}

	async fetchLastByEmail(email: string): Promise<MailCodeInterface | null> {
		if (!email) throw Error(getErrorMessage('missingField', 'Email ao qual solicitou o codigo'));

		return await this.database.fetchLastByEmail(email);
	}

	async create(data: { email: string }): Promise<number> {
		if (!data.email) throw Error(getErrorMessage('missingField', 'Email'));
		const code = crypto.randomBytes(4).toString('hex');

		const insertData: MailCodeInterface = {
			email: data.email,
			code: code
		};

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const result: any = await this.database.create(insertData);
		return result[0].insertId;
	}

	async update(data: MailCodeInterface, id: number) {
		const toUpdate: MailCodeInterface = {

		};

		if (data.status) toUpdate.status = data.status;
		if (Object.keys(toUpdate).length === 0) throw Error(getErrorMessage('noValidDataFound'));

		await this.database.update(toUpdate, id);
	}
}

export default MailCodeService;
