export interface ProjectInterface {
    id?: number;
    name?: string;
    organization_id?: string;
    api_key?: string;
    reg_date?: Date;
    update_date?: Date;
    user_account_id?: number;
}

export interface ProjectInsertInterface extends ProjectInterface {
    name: string;
    organization_id: string;
    api_key: string;
    user_account_id: number;
}
