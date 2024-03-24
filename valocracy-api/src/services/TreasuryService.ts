import { providerSepolia } from '@/loaders/ethers.provider';
import { ethers } from 'ethers';
import env from '../config/index';
import * as fs from 'fs';
import * as path from 'path';

const abiPath = path.join(__dirname, '../../contracts/abi/valocracy.json');
const abi = fs.readFileSync(abiPath, 'utf-8');
export default class TreasuryService {
	private static balance: number = 0;

	private static contractAddress = '0x068FEB656BdFe6Db58b55Af7Ed7fbe4E0cEb52EC';
	private static usdtAddress = '0x690000ef01dece82d837b5faa2719ae47b156697';


	static async initialize() {
		await this.getTotalBalance();
	}

	setBalance(balance: number) {
		TreasuryService.balance = balance;
	}

	deposit(value: number) {
		TreasuryService.balance += value;
	}

	shareOf(percent: number): number {
		const balance = this.getBalance();
		if(balance === 0) throw Error('Treasury lack funds for withdrawal');

		return balance * percent / 100;
	}

	// async withdrawContract(amount: number,wallet_address: string) {
		
	// 	const balance = this.getBalance();
	// 	if(balance === 0) throw Error('Treasury lack funds for withdrawal');
	// 	if(amount === 0) throw Error('Amount cannot be 0');
	// 	if(!wallet_address) throw Error('"wallet_address" not found');
		
	// 	const wallet = new ethers.Wallet(env.KEY_SECRET_WALLET_SEPOLIA_VALOCRACY);
	// 	const signer = wallet.connect(providerSepolia);
	// 	const contract = new ethers.Contract(TreasuryService.contractAddress, abi, signer);
	// 	const bigNum = ethers.parseUnits(String(amount), 6);
	// 	const withdraw = await contract.withdraw(bigNum.toString(),TreasuryService.usdtAddress,env.ADDRESS_WALLET_SEPOLIA_VALOCRACY);

	// 	/*	
	// 		link etherscan sepolia:
	// 		https://sepolia.etherscan.io/tx/${HASH}
	// 	*/
	// 	const hash = withdraw.hash;
	// 	console.log(hash);
	// 	console.log(`https://sepolia.etherscan.io/tx/${hash}`);

	// 	TreasuryService.setBalance(TreasuryService.balance - amount);

	// 	return {hash:hash};
	// }

	async __withdraw(withdrawAmount: string, walletAddress: string) {
		const wallet = new ethers.Wallet(env.KEY_SECRET_WALLET_SEPOLIA_VALOCRACY);
		const signer = wallet.connect(providerSepolia);
		const contract = new ethers.Contract(TreasuryService.contractAddress, abi, signer);
		const bigNum = ethers.parseUnits(withdrawAmount, 18);
		return await contract.withdraw(bigNum.toString(),TreasuryService.usdtAddress, walletAddress);
	}

	async withdraw(percent: number, wallet_address: string) {
		const balance = this.getBalance();
		if(balance === 0) throw Error('Treasury lack funds for withdrawal');
		if(!wallet_address) throw Error('Wallet address not found');
		
		const withdrawAmount = balance * percent / 100;
		const withdrawData = await this.__withdraw(withdrawAmount.toFixed(2), wallet_address);
		this.setBalance(balance - withdrawAmount);

		return { withdraw_amount: withdrawAmount, claim_hash: withdrawData.hash };
	}

	getBalance() {
		return TreasuryService.balance;
	}

	static async getTotalBalance(){

		const contract = new ethers.Contract(TreasuryService.contractAddress, abi, providerSepolia);
		const balance = await contract.totalBalance(TreasuryService.usdtAddress);

		const balanceInUSDT = ethers.formatUnits(balance, 18);

		TreasuryService.balance = parseFloat(balanceInUSDT);
	}
}

