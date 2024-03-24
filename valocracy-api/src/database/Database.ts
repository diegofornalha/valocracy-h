/* eslint-disable @typescript-eslint/no-explicit-any */
import { getErrorMessage } from '@/helpers/response_collection';
import { sleep } from '@/helpers/util';
import MysqlService from '@/services/MysqlService';
import { PoolConnection } from 'mysql2/promise';
import { RetryOperation, operation as _operation } from 'retry';

export default class Database {
	protected static connection: PoolConnection;
	private operation: RetryOperation;

	constructor() {
		this.operation = _operation();
		(async () => {
			if(!Database.connection) Database.connection = await MysqlService.getConnection();
		})();
	}

	static async startConnection() {
		Database.connection = await MysqlService.getConnection();
	}

	async getConnection(): Promise<PoolConnection> {
		if (!Database.connection) {
			await new Promise((resolve, reject) => {
				this.operation.attempt(async (currentAttempt: number) => {
					Database.connection = await MysqlService.getConnection(true);
					await sleep(2000);

					if (!Database.connection) {
						if (currentAttempt < 4) {
							this.operation.retry(getErrorMessage('databaseConnectionPending'));
							return;
						}

						reject(getErrorMessage('databaseConnectionPending'));
					}


					resolve(true);
				});
			});
		}

		const isAlive = await new Promise((resolve, reject) => {
			(async () => {
				try {
					const result = await MysqlService.isConnectionAlive(Database.connection);

					resolve(result);
				} catch (error) {
					reject(reject);
				}
			})();

		});

		if (!isAlive) {
			if (Database.connection) Database.connection.destroy();

			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(Database.connection as any) = null;
			return await this.getConnection();
		}

		return Database.connection;
	}

	protected async query(sql: string, value: any = null): Promise<any> {
		if (value) {
			return (await this.getConnection()).query(sql, value);
		} else {
			return (await this.getConnection()).query(sql);
		}
	}

	public static async startTransaction() {
		if (!Database.connection) throw Error(getErrorMessage('noDatabaseConnection'));

		await Database.connection.beginTransaction();
		// await (await this.connection).query('START TRANSACTION;');
	}

	public static async rollback() {
		if (!Database.connection) throw Error(getErrorMessage('noDatabaseConnection'));

		await Database.connection.rollback();
		// await (await this.connection).query('ROLLBACK;');
	}

	public static async commit() {
		if (!Database.connection) throw Error(getErrorMessage('noDatabaseConnection'));

		await Database.connection.commit();
		// await (await this.connection).query('COMMIT;');
	}

	public static async release() {
		if (Database.connection) Database.connection.release();
	}
}