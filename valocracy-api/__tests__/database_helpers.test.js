/* eslint-disable no-undef */
import { createBindParams } from '../src/helpers/util';

test('Entering one object should return one string containing sql condition arranged by label and respective symbol for binding', () => {
	const conditions = createBindParams({ 'abacate': 1, 'type': 'brazilian' });

	expect(conditions).toEqual('abacate = ?, type = ?');
});

test('Entering one object with null value should return one string containing sql condition arranged by label and respective symbol for binding', () => {
	const conditions = createBindParams({ 'abacate': 1, 'type': null });

	expect(conditions).toEqual('abacate = ?, type = NULL');
});