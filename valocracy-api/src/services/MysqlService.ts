import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import env from '@/config';

const { DB_HOSTNAME, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME } = env;

class MysqlService {
	private static count = 0;
	private static connection: Pool;

	private constructor() { }

	public static async isConnectionAlive(connection: PoolConnection): Promise<boolean> {
		const isAlive = await connection.query('SELECT 1').then(() => true).catch(() => false);
		console.log('isConnectionAlive', isAlive);

		return isAlive;
	}

	public static getConnection = async (createNewConnection = false): Promise<PoolConnection> => {
		const isAlive = this.connection ? await this.connection.query('SELECT 1').then(() => true).catch(() => false) : false;
		console.log('getConnection', isAlive);
		if (!isAlive || createNewConnection) {
			MysqlService.connectWithRetry();
		}
		return (await this.connection.getConnection());
	};

	private static connectWithRetry = (): void => {
		try {
			console.log('Attempting Mysql connection (will retry if needed)');
			// console.log(Object.keysthis.connection);
			if(this.connection && this.connection.destroy) this.connection.destroy();
			this.connection = mysql.createPool({
				host: DB_HOSTNAME,
				user: DB_USERNAME,
				password: DB_PASSWORD,
				database: DB_NAME,
				port: DB_PORT,
				waitForConnections: true,
				connectionLimit: 20,
				connectTimeout: 15000,
				queueLimit: 0,
				enableKeepAlive: true
			});
		
		} catch (err) {
			const retrySeconds = 5;
			console.log(
				`Mysql connection unsuccessful (will retry #${++this.count} after ${retrySeconds} seconds):`,
				err
			);
			setTimeout(this.connectWithRetry, retrySeconds * 1000);
		}
	};
}

export default MysqlService;
