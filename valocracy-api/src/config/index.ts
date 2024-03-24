import dotenv from 'dotenv';

const getEnvs = () => {
	const dotenvResult = dotenv.config({ path: '.env' });

	if (dotenvResult.error) {
		const processEnv = process.env;

		if (processEnv && !processEnv.error) return processEnv;
	}

	return dotenvResult;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const envFound: any = getEnvs();

if (envFound.error) {
	// This error should crash whole process

	throw new Error(`Couldn't find .env file. ${envFound.error}`);
}

interface ENV {
	PORT: number,
	WS_PORT: number,
	JWT_SECRET: string,
	DEBUG: boolean,
	DB_HOSTNAME: string,
	DB_PORT: number,
	DB_USERNAME: string,
	DB_PASSWORD: string,
	DB_NAME: string,
	SECRET_SALT: string,
	SECRET: string,
	MAIL_SENDER: string,
	MAIL_SENDER_PWD: string,
	DISCORD_API_ENDPOINT: string,
	DISCORD_TOKEN: string,
	DISCORD_CLIENT_ID: string,
	DISCORD_CLIENT_SECRET: string,
	DISCORD_REDIRECT_URI: string,
	DISCORD_SERVER_ID: string,
	PINATA_TOKEN: string,
	PINATA_BASE_URI: string,
	API_SECRET_INFURA_SEPOLIA: string,
	ADDRESS_WALLET_SEPOLIA_VALOCRACY: string,
	KEY_SECRET_WALLET_SEPOLIA_VALOCRACY: string,
}

const env: ENV = {
	// Application
	PORT: Number(process.env.PORT),
	WS_PORT: Number(process.env.WS_PORT),
	JWT_SECRET: process.env.JWT_SECRET || '',
	DEBUG: Boolean(process.env.DEBUG) || false,
	DB_HOSTNAME: process.env.DB_HOSTNAME || '',
	DB_PORT: Number(process.env.DB_PORT),
	DB_USERNAME: process.env.DB_USERNAME || '',
	DB_PASSWORD: process.env.DB_PASSWORD || '',
	DB_NAME: process.env.DB_NAME || '',
	SECRET_SALT: process.env.SECRET_SALT || '',
	SECRET: process.env.SECRET || '',
	MAIL_SENDER: process.env.MAIL_SENDER || '',
	MAIL_SENDER_PWD: process.env.MAIL_SENDER_PWD || '',
	DISCORD_API_ENDPOINT: process.env.DISCORD_API_ENDPOINT || '',
	DISCORD_TOKEN: process.env.DISCORD_TOKEN || '',
	DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID || '',
	DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET || '',
	DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI || '',
	DISCORD_SERVER_ID: process.env.DISCORD_SERVER_ID || '',
	PINATA_TOKEN: process.env.PINATA_TOKEN || '',
	PINATA_BASE_URI: process.env.PINATA_BASE_URI || '',
	API_SECRET_INFURA_SEPOLIA: process.env.API_SECRET_INFURA_SEPOLIA || '',
	ADDRESS_WALLET_SEPOLIA_VALOCRACY: process.env.ADDRESS_WALLET_SEPOLIA_VALOCRACY || '',
	KEY_SECRET_WALLET_SEPOLIA_VALOCRACY: process.env.KEY_SECRET_WALLET_SEPOLIA_VALOCRACY || '',
};

export default env;
