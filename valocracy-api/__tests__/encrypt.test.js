/* eslint-disable no-undef */
import { encryptAES, decryptAES } from '../src/helpers/util';

const env = { 'SECRET': 'BraZilIAn2023projectt@', 'SECRET_SALT': '12234567' };
const expectedEncryptedData = '+CoP+T4FeRgeXpLcgkk/ZQ==';

test('Data and object containing salt and secret should return crypted string by AES', () => {
	const result = encryptAES('valocracy', env);

	expect(result).toEqual(expectedEncryptedData);
});


test('AES encrypted string and object containing salt and secret should return string decrypted', () => {
	const result = decryptAES(expectedEncryptedData, env);

	expect(result).toEqual('valocracy');
});