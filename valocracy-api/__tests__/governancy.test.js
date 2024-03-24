import EffortDatabase from '@/database/EffortDatabase';
import ProposalDatabase from '@/database/ProposalDatabase';
import ProposalUserPowerDatabase from '@/database/ProposalUserPowerDatabase';
import VoteDatabase from '@/database/VoteDatabase';
import UserDatabase from '@/database/UserDatabase';
import EffortService from '@/services/EffortService';
import GovernanceService from '@/services/GovernanceService';
import ProposalService from '@/services/ProposalService';
import { ProposalVoteEnum } from '@/enums/ProposalVoteEnum';
import { ProposalStatusEnum } from '@/enums/ProposalStatusEnum';

jest.mock('@/database/EffortDatabase');
jest.mock('@/database/UserDatabase');
jest.mock('@/database/Database');
jest.mock('@/database/ProposalUserPowerDatabase');
jest.mock('@/database/VoteDatabase');
jest.mock('@/database/ProposalDatabase');

let efforts = [];
let proposals = [];
const effortService = new EffortService();
const governanceService = new GovernanceService();

beforeAll(() => {
	jest.spyOn(UserDatabase.prototype, 'fetchAll').mockImplementation(() => {
		return efforts.reduce((acc, effort) => {
			if(!acc.includes(effort.user_account_id)) acc.push(effort.user_account_id);

			return acc;
		}, []).map((r) => { return {id: r};});
	});

	jest.spyOn(EffortService.prototype, 'create').mockImplementation((effort) => {
		efforts.push(effort);
	});
	jest.spyOn(EffortDatabase.prototype, 'fetchTotalGovernancePower').mockImplementation(() => {
		return efforts.reduce((acc, effort) => acc + effort.weight, 0);
	});
	jest.spyOn(EffortDatabase.prototype, 'fetchGovernancePowerOfUser').mockImplementation((id) => {
		return efforts.reduce((acc, effort) => {
			if(effort.user_account_id === id) acc += effort.weight;

			return acc;
		}, 0);
	});

	jest.spyOn(ProposalService.prototype, 'create').mockImplementation(async (proposal) => {
		const economyPowerBalance = await effortService.fetchTotalGovernancePower();

		proposals.push({...proposal, governance_power_balance: economyPowerBalance, status: ProposalStatusEnum.OPEN, votes: [], users_power: [] });
		return proposal.id;
	});
	jest.spyOn(ProposalDatabase.prototype, 'fetchVotedQuorum').mockImplementation((proposalId) => {
		const proposal = proposals.find((proposal) => proposal.id === proposalId);

		return proposal.votes.reduce((acc, vote) => acc + vote.user_power, 0);
	});
	jest.spyOn(ProposalDatabase.prototype, 'fetchVoteTotalPower').mockImplementation((proposalId, voteAnswer) => {
		const proposal = proposals.find((proposal) => proposal.id === proposalId);

		return proposal.votes.reduce((acc, vote) => acc + (vote.answer === voteAnswer ? vote.user_power : 0), 0);
	});
	jest.spyOn(ProposalDatabase.prototype, 'fetch').mockImplementation((proposalId) => {
		return proposals.find((proposal) => proposal.id === proposalId);
	});
	jest.spyOn(ProposalDatabase.prototype, 'update').mockImplementation((proposal, proposalId) => {
		const proposalIndex = proposals.findIndex((_proposal) => _proposal.id === proposalId);

		proposals[proposalIndex] = {
			...proposals[proposalIndex],
			...proposal
		};
	});

	jest.spyOn(ProposalUserPowerDatabase.prototype, 'create').mockImplementation(async (proposalUserPower) => {
		const proposalIndex = proposals.findIndex((_proposal) => _proposal.id === proposalUserPower.proposal_id);
		
		proposals[proposalIndex]['users_power'].push(proposalUserPower);
		return [{ insertId: 1 }];
	});

	jest.spyOn(ProposalUserPowerDatabase.prototype, 'fetch').mockImplementation(async (proposalId, userAccountId) => {
		const proposal = proposals.find((p) => p.id === proposalId);
		return proposal ? proposal.users_power.find((u) => u.user_account_id === userAccountId) : null;
	});

	jest.spyOn(VoteDatabase.prototype, 'fetchByProposalAndUser').mockImplementation((proposalId, userAccountId) => {
		const proposal = proposals.find((_proposal) => _proposal.id === proposalId);

		return proposal.votes.find((_vote) => _vote.user_account_id === userAccountId);
	});
	jest.spyOn(VoteDatabase.prototype, 'create').mockImplementation((vote) => {
		const proposalIndex = proposals.findIndex((_proposal) => _proposal.id === vote.proposal_id);

		proposals[proposalIndex].votes.push(vote);
		return [ { insertedId: vote.id } ];
	});
});

beforeEach(() => {
	efforts = [];
	proposals = [];
	effortService.create({
		id: 1,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 1,
		user_name: 'John',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#1',
		text: 'The beginning'
	});
	effortService.create({
		id: 2,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 2,
		user_name: 'Cena',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#2',
		text: 'The beginning'
	});

	effortService.create({
		id: 3,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 3,
		user_name: 'Mary',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#3',
		text: 'The beginning'
	});

	effortService.create({
		id: 4,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 4,
		user_name: 'Jane',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#4',
		text: 'The beginning'
	});
	effortService.create({
		id: 5,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 5,
		user_name: 'Mike',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#5',
		text: 'The beginning'
	});
	effortService.create({
		id: 6,
		effort_rarity_id: 3,
		effort_nature_id: 1,
		user_account_id: 6,
		user_name: 'Doug',
		is_claimed: 0,
		weight: 1,
		title: 'Effort#6',
		text: 'The beginning'
	});
});

test('Majority aproved votes, test if the status is Aproved.', async () => {
	const proposalId = 1;
	await governanceService.open({
		id: proposalId,
		title: 'Proposal#1'
	});

	governanceService.vote({
		user_account_id: 1, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 2, proposal_id: proposalId, answer: ProposalVoteEnum.NO
	});
	governanceService.vote({
		user_account_id: 3, proposal_id: proposalId, answer: ProposalVoteEnum.ABSTAIN
	});
	governanceService.vote({
		user_account_id: 4, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 5, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 6, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});

	await governanceService.close(proposalId);

	const proposalStatus = await governanceService.status(proposalId);
	expect(proposalStatus).toEqual(ProposalStatusEnum.APPROVED);
});

test('Majority reproved votes, test if the status is Reproved.', async () => {
	const proposalId = 1;
	await governanceService.open({
		id: proposalId,
		title: 'Proposal#1'
	});

	governanceService.vote({
		user_account_id: 1, proposal_id: proposalId, answer: ProposalVoteEnum.ABSTAIN
	});
	governanceService.vote({
		user_account_id: 2, proposal_id: proposalId, answer: ProposalVoteEnum.NO
	});
	governanceService.vote({
		user_account_id: 3, proposal_id: proposalId, answer: ProposalVoteEnum.NO
	});
	governanceService.vote({
		user_account_id: 4, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 5, proposal_id: proposalId, answer: ProposalVoteEnum.NO
	});
	governanceService.vote({
		user_account_id: 6, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});

	await governanceService.close(proposalId);

	const proposalStatus = await governanceService.status(proposalId);
	expect(proposalStatus).toEqual(ProposalStatusEnum.REPROVED);
});

test('If one third veted, the status of proposal should be veted.', async () => {
	const proposalId = 1;
	await governanceService.open({
		id: proposalId,
		title: 'Proposal#1'
	});

	governanceService.vote({
		user_account_id: 1, proposal_id: proposalId, answer: ProposalVoteEnum.VETO
	});
	governanceService.vote({
		user_account_id: 2, proposal_id: proposalId, answer: ProposalVoteEnum.VETO
	});
	governanceService.vote({
		user_account_id: 3, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 4, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 5, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 6, proposal_id: proposalId, answer: ProposalVoteEnum.ABSTAIN
	});

	await governanceService.close(proposalId);

	const proposalStatus = await governanceService.status(proposalId);
	expect(proposalStatus).toEqual(ProposalStatusEnum.VETOED);
});

test('If half abstained, proposal should be invalidated.', async () => {
	const proposalId = 1;
	await governanceService.open({
		id: proposalId,
		title: 'Proposal#1'
	});

	governanceService.vote({
		user_account_id: 1, proposal_id: proposalId, answer: ProposalVoteEnum.ABSTAIN
	});
	governanceService.vote({
		user_account_id: 2, proposal_id: proposalId, answer: ProposalVoteEnum.ABSTAIN
	});
	governanceService.vote({
		user_account_id: 3, proposal_id: proposalId, answer: ProposalVoteEnum.ABSTAIN
	});
	governanceService.vote({
		user_account_id: 4, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 5, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});
	governanceService.vote({
		user_account_id: 6, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});

	await governanceService.close(proposalId);

	const proposalStatus = await governanceService.status(proposalId);
	expect(proposalStatus).toEqual(ProposalStatusEnum.INVALIDATED);
});

test('If less than 20% participate, proposal should be invalidated.', async () => {
	const proposalId = 1;
	await governanceService.open({
		id: proposalId,
		title: 'Proposal#1'
	});
	governanceService.vote({
		user_account_id: 1, proposal_id: proposalId, answer: ProposalVoteEnum.YES
	});

	await governanceService.close(proposalId);

	const proposalStatus = await governanceService.status(proposalId);
	expect(proposalStatus).toEqual(ProposalStatusEnum.INVALIDATED);
});

test('No one voted, proposal should be invalidated.', async () => {
	const proposalId = 1;
	await governanceService.open({
		id: proposalId,
		title: 'Proposal#1'
	});
	await governanceService.close(proposalId);

	const proposalStatus = await governanceService.status(proposalId);
	expect(proposalStatus).toEqual(ProposalStatusEnum.INVALIDATED);
});