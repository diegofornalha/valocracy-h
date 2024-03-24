/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
import { maskEmail } from '../src/helpers/util';

test('Email username field should be masked with ** lefting just the first two and last character stading', () => {
	const email = 'valocracy@valo.xyz';
	const masked = maskEmail(email);

	expect(masked).toEqual('va**y@valo.xyz');
});