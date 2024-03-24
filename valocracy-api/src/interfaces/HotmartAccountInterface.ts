export interface HotmartAccountInterface {
    hotmart_id?: string;
    email?: string;
    name?: string;
    status?: boolean;
    plan?: string,
    plan_adherence?: string,
    last_payment?: string,
    due_date?: string,
    phone?: string
}

export interface HotmartAccountUpdateInterface {
    plan_adherence?: string;
    due_date?: string;
    last_payment?: string;
    phone?: string;
}