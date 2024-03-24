import { Effort } from '@/interfaces/EffortInterface';
import EffortService from './EffortService';
import TreasuryService from './TreasuryService';
import { getErrorMessage } from '@/helpers/response_collection';
import UserMetamaskService from './UserMetamaskService';
import { UserMetamaskInterface } from '@/interfaces/UserMetamaskInterface';

export default class EconomyService {
	private treasury: TreasuryService;
	private effortService: EffortService;

	constructor() {
		this.treasury = new TreasuryService();
		this.effortService = new EffortService();
	}

	getTreasuryBalance() {
		return this.treasury.getBalance();
	}

	deposit(value: number) {
		this.treasury.deposit(value);
	}

	async shareOfUser(id: number): Promise<number> {
		const relEconomicUserPowerPerc = await this.effortService.getRelativeEconomicPowerOfUser(id);

		return this.treasury.shareOf(relEconomicUserPowerPerc);
	}

	async shareOfEffort(id: string): Promise<number> {
		const relEconomicEffortPowerPerc = await this.effortService.getRelativeEconomicPowerOfEffort(id);

		return this.treasury.shareOf(relEconomicEffortPowerPerc);
	}

	async claimAllOfUser(id: number) {
		const unclaimedEfforts: Array<Effort> = await this.effortService.fetchUnclaimedByUser(id);
		let claimedBalance: number = 0;

		for (const unclaimedEffort of unclaimedEfforts) {
			claimedBalance += await this.claimByEffort(String(unclaimedEffort.id), id);
		}

		return claimedBalance;
	}

	async claimByEffort(id: string, userAccountId: number) {
		const userMetamaskServce = new UserMetamaskService();
		const effort: Effort | null = await this.effortService.fetch(id);
		if(!effort) throw Error(getErrorMessage('registryNotFound', 'Esforço'));
		if(effort?.is_claimed) throw Error(`Effort [${id}] is already claimed`);
		if(effort.user_account_id !== userAccountId) throw Error(getErrorMessage('solicitedRegistryIsNotYours'));
		
		const userWalletData: Array<UserMetamaskInterface> = await userMetamaskServce.fetchByUserAccount(userAccountId);
		if(userWalletData.length === 0) throw Error(getErrorMessage('missingUserWalletConnectin'));

		const effortRelativePower: number = await this.effortService.getRelativeEconomicPowerOfEffort(id);
		const claimedData = await this.treasury.withdraw(effortRelativePower, String(userWalletData[0].address));

		await this.effortService.claim(claimedData?.withdraw_amount, claimedData?.claim_hash, id);

		return claimedData?.withdraw_amount;
	}
}
