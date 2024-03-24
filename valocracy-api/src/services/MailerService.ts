import env from '@/config';
import EmailInterface from '@/interfaces/EmailIinterface';
import nodemailer from 'nodemailer';
import { getErrorMessage } from '../helpers/response_collection';

class MailerService {
	private transporter;

	constructor() {
		if (!env?.MAIL_SENDER) throw Error(getErrorMessage('missConfiguredService', 'Envio de email [Sender]'));
		if (!env?.MAIL_SENDER_PWD) throw Error(getErrorMessage('missConfiguredService', 'Envio de email [SenderP]'));
		// email-ssl.com.br
		this.transporter = nodemailer.createTransport({
			host: 'email-ssl.com.br',
			port: 587,
			secure: false,                // true for 465, false for other ports
			auth: {
				user: env.MAIL_SENDER,      // generated ethereal user
				pass: env.MAIL_SENDER_PWD,  // generated ethereal password
			},
		});
	}

	async send(mail: EmailInterface) {
		await this.transporter.sendMail(mail);
	}
}

export default MailerService;