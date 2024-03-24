import EffortDatabase from '@/database/EffortDatabase';
import UserMetamaskDatabase from '@/database/UserMetamaskDatabase';
import EffortService from '@/services/EffortService';
import TreasuryService from '@/services/TreasuryService';
import EconomyService from '@/services/EconomyService';

jest.mock('canvas');
jest.mock('@/database/EffortDatabase');
jest.mock('@/database/UserMetamaskDatabase');

let balance = 0;
let efforts = [];
const treasuryService = new TreasuryService();
const economyService = new EconomyService();
const effortService = new EffortService();

beforeAll(() => {
	// Treasury Service
	jest.spyOn(TreasuryService.prototype, 'getBalance').mockImplementation(() => {
		return balance;
	});
	jest.spyOn(TreasuryService.prototype, 'deposit').mockImplementation((value) => {
		balance += value;
	});
	jest.spyOn(TreasuryService.prototype, 'setBalance').mockImplementation((value) => {
		balance = value;
	});
	jest.spyOn(TreasuryService.prototype, '__withdraw').mockImplementation(() => {
		return { hash: '0x1111111111111' };
	});

	// Effort Service
	jest.spyOn(EffortService.prototype, 'create').mockImplementation((effort) => {
		efforts.push(effort);
	});

	// Effort Database
	jest.spyOn(EffortDatabase.prototype, 'fetchTotalEconomicPower').mockImplementation(() => {
		return efforts.reduce((acc, effort) => acc + (!effort?.is_claimed ? effort.weight : 0), 0);
	});
	jest.spyOn(EffortDatabase.prototype, 'fetchEconomicPowerOfUser').mockImplementation((id) => {
		return efforts.reduce((acc, effort) => {
			if(effort.user_account_id === id && !effort?.is_claimed) acc += effort.weight;

			return acc;
		}, 0);
	});
	jest.spyOn(EffortDatabase.prototype, 'fetchEconomicPowerOfEffort').mockImplementation((id) => {
		return efforts.reduce((acc, effort) => {
			if(effort.id == id && !effort?.is_claimed) acc += effort.weight;

			return acc;
		}, 0);
	});
	jest.spyOn(EffortDatabase.prototype, 'fetch').mockImplementation((id) => {
		return efforts.find((effort) => effort.id == id);
	});
	jest.spyOn(EffortDatabase.prototype, 'update').mockImplementation((effort, id) => {
		const effortIndex = efforts.findIndex((effort) => effort.id == id);

		efforts[effortIndex] = {
			...efforts[effortIndex],
			...effort
		};
	});
	jest.spyOn(EffortDatabase.prototype, 'fetchUnclaimedByUser').mockImplementation((id) => {
		return efforts.filter((effort) => effort.user_account_id === id && !effort?.is_claimed);
	});

	// UserMetamaskDatabase
	jest.spyOn(UserMetamaskDatabase.prototype, 'fetchByUserAccount').mockImplementation((id) => {
		const effort = efforts.filter((effort) => effort.user_account_id === id);

		return [{	
			address: effort.user_wallet_address,
			user_account_id: id
		}];
	});

});

beforeEach(() => {
	efforts = [];
	effortService.create({
		id: 1,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 1,
		user_wallet_address: '0x992aaeb878feaf573e9717ed3753839555111111',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#1',
		text: 'The beginning'
	});
	effortService.create({
		id: 2,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 1,
		user_wallet_address: '0x992aaeb878feaf573e9717ed3753839555111111',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#2',
		text: 'The beginning'
	});

	effortService.create({
		id: 3,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 2,
		user_wallet_address: '0x992aaeb878feaf573e9717ed3753839555111112',
		is_claimed: 0,
		weight: 2,
		title: 'Effort#3',
		text: 'The beginning'
	});

	effortService.create({
		id: 4,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 3,
		user_wallet_address: '0x992aaeb878feaf573e9717ed3753839555111113',
		is_claimed: 0,
		weight: 3,
		title: 'Effort#4',
		text: 'The beginning'
	});
	effortService.create({
		id: 5,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 4,
		user_wallet_address: '0x992aaeb878feaf573e9717ed3753839555111114',
		is_claimed: 0,
		weight: 3,
		title: 'Effort#5',
		text: 'The beginning'
	});
	treasuryService.setBalance(0);
	treasuryService.deposit(1000);
});

test('Share distributed among users must be correct the percent by users', async () => {
	const shareOfUser1 = await economyService.shareOfUser(1);
	const shareOfUser2 = await economyService.shareOfUser(2);
	const shareOfUser3 = await economyService.shareOfUser(3);
	const shareOfUser4 = await economyService.shareOfUser(4);

	expect(shareOfUser1).toEqual(200);
	expect(shareOfUser2).toEqual(200);
	expect(shareOfUser3).toEqual(300);
	expect(shareOfUser4).toEqual(300);
});

test('Share distributed among users must be correct the percent by effort', async () => {
	const shareOfEffort1 = await economyService.shareOfEffort(1);
	const shareOfEffort2 = await economyService.shareOfEffort(2);
	const shareOfEffort3 = await economyService.shareOfEffort(3);
	const shareOfEffort4 = await economyService.shareOfEffort(4);
	const shareOfEffort5 = await economyService.shareOfEffort(5);

	expect(shareOfEffort1).toEqual(100);
	expect(shareOfEffort2).toEqual(100);
	expect(shareOfEffort3).toEqual(200);
	expect(shareOfEffort4).toEqual(300);
	expect(shareOfEffort5).toEqual(300);
});

test('Effort withdraw from treasury and check users share many times', async () => {
	expect(economyService.getTreasuryBalance()).toEqual(1000);
	expect(await economyService.shareOfUser(1)).toEqual(200);
	expect(await economyService.shareOfEffort(1)).toEqual(100);
	expect(await economyService.shareOfEffort(2)).toEqual(100);

	expect(await economyService.claimByEffort(1, 1)).toEqual(100);

	expect(economyService.getTreasuryBalance()).toEqual(900);
	expect(await economyService.shareOfUser(1)).toBeCloseTo(100, 1);
	expect(await economyService.shareOfEffort(1)).toEqual(0);
	expect(await economyService.shareOfEffort(2)).toBeCloseTo(100, 1);

	expect(await economyService.shareOfUser(2)).toBeCloseTo(200, 1);
	expect(await economyService.shareOfUser(3)).toBeCloseTo(300, 1);
	expect(await economyService.shareOfUser(4)).toBeCloseTo(300, 1);

	expect(await economyService.shareOfEffort(3)).toBeCloseTo(200, 1);
	expect(await economyService.shareOfEffort(4)).toBeCloseTo(300, 1);
	expect(await economyService.shareOfEffort(5)).toBeCloseTo(300, 1);
});

test('User withdraw from treasury and check users share many times', async () => {
	expect(economyService.getTreasuryBalance()).toEqual(1000);
	expect(await economyService.shareOfUser(1)).toEqual(200);
	expect(await economyService.shareOfEffort(1)).toEqual(100);
	expect(await economyService.shareOfEffort(2)).toEqual(100);

	expect(await economyService.claimAllOfUser(1)).toBeCloseTo(200, 1);

	expect(economyService.getTreasuryBalance()).toBeCloseTo(800, 1);
	expect(await economyService.shareOfUser(1)).toBeCloseTo(0, 1);
	expect(await economyService.shareOfEffort(1)).toEqual(0);
	expect(await economyService.shareOfEffort(2)).toBeCloseTo(0, 1);

	expect(await economyService.shareOfUser(2)).toBeCloseTo(200, 1);
	expect(await economyService.shareOfUser(3)).toBeCloseTo(300, 1);
	expect(await economyService.shareOfUser(4)).toBeCloseTo(300, 1);

	expect(await economyService.shareOfEffort(3)).toBeCloseTo(200, 1);
	expect(await economyService.shareOfEffort(4)).toBeCloseTo(300, 1);
	expect(await economyService.shareOfEffort(5)).toBeCloseTo(300, 1);
});


test('Hybrid withdraw from treasury many times', async () => {
	expect(economyService.getTreasuryBalance()).toEqual(1000);
	expect(await economyService.shareOfUser(1)).toEqual(200);
	expect(await economyService.shareOfEffort(1)).toEqual(100);
	expect(await economyService.shareOfEffort(2)).toEqual(100);

	expect(await economyService.claimByEffort(1, 1)).toBeCloseTo(100, 1);
	expect(await economyService.claimAllOfUser(1)).toBeCloseTo(100, 1);

	expect(economyService.getTreasuryBalance()).toBeCloseTo(800, 1);
	expect(await economyService.shareOfUser(1)).toBeCloseTo(0, 1);
	expect(await economyService.shareOfEffort(1)).toEqual(0);
	expect(await economyService.shareOfEffort(2)).toBeCloseTo(0, 1);

	expect(await economyService.shareOfUser(2)).toBeCloseTo(200, 1);
	expect(await economyService.shareOfUser(3)).toBeCloseTo(300, 1);
	expect(await economyService.shareOfUser(4)).toBeCloseTo(300, 1);

	expect(await economyService.shareOfEffort(3)).toBeCloseTo(200, 1);
	expect(await economyService.shareOfEffort(4)).toBeCloseTo(300, 1);
	expect(await economyService.shareOfEffort(5)).toBeCloseTo(300, 1);
});