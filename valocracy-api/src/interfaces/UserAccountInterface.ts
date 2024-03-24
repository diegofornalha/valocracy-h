import { UserValidationType } from '@/enums/UserValidationTypeEnum';

export interface UserAccountInterface {
	id?: number;
	full_name?: string;
	username?: string;
	password?: string,
	email?: string;
	phone?: string;
	discord_id?: string;
	ignore_original_hotmart_account?: boolean,
	acc_lvl?: string,
	reg_date?: string;
	update_date?: string;
}

export interface UserAccountInsertBodyInterface extends UserAccountInterface {
	username: string,
	email: string,
	phone: string,
	validation: {
		id: number,
		code: string
		validation_type: UserValidationType
	}
}

export interface UserAccountUpdateInterface extends UserAccountInterface {
	username?: string,
	phone?: string,
	ignore_original_hotmart_account?: boolean,
	valido?: {
		id: number,
		code: number
	},
	email_validation?: {
		id: number,
		code: string
	}
}