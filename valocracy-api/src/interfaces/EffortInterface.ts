export interface EffortInterface {
    id?: string,
    title: string,
    subtitle?: string,
    text: string,
    image_url?: string,
    reg_date?: string
    effort_rarity_id: number,
    effort_nature_id: number,
    user_account_id: number,
    is_claimed?: number,
    claim_date?: string,
    claimed_balance?: number,
    mint_transaction_hash?:string,
    claim_transaction_hash?:string

}

export interface EffortHash {
    mint_transaction_hash?:string,
    claim_transaction_hash?:string
}

interface EffortPayloadInterface extends EffortInterface {
    background_image_base64: string
}
export type Effort = EffortInterface;
export type EffortPayload = EffortPayloadInterface;
