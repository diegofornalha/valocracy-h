export interface ProposalInterface {
    id?: number,
    title: string,
    governance_power_balance: number,
    status: string,
    reg_date?: string
}

export interface ProposalCompostInterface {
    id?: number,
    title: string,
    governance_power_balance: number,
    status: string,
    reg_date?: string,
    answer: string
}


export type Proposal = ProposalInterface | ProposalCompostInterface;