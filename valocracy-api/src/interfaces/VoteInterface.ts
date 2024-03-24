interface VoteInterface {
    id?: number,
    answer: string,
    user_power: number,
    reg_date?: string,
    user_account_id: number,
    proposal_id: number
}

export type Vote = VoteInterface;