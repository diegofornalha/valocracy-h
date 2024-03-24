import {ethers} from 'ethers';
import env from '../config/index';

console.log('adr',env.API_SECRET_INFURA_SEPOLIA);
//const providerSepolia = new ethers.JsonRpcProvider(`https://sepolia.infura.io/v3/${env.API_SECRET_INFURA_SEPOLIA}`);
const providerSepolia = new ethers.JsonRpcProvider('https://sepolia-rpc.scroll.io/');

export {
	providerSepolia
};