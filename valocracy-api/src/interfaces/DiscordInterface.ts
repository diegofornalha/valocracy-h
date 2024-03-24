/* eslint-disable @typescript-eslint/no-explicit-any */
export interface DiscordGuidInterface {
    id: string,
    name: string,
    icon: string | null,
    owner: boolean,
    permissions: string,
    features: []
}

export interface DiscordUserInterface {
    id?: string,
    discord_id: string,
    discord_name?: string,
    discord_email?: string,
    discord_global_name?: string,
    discord_avatar?: string,
    discord_guilda_roles?: string,
    discord_banner_color?:string
    discord_joined_at_guilda?: Date | '',
    user_id:number,
    roles?: Array<any>
}

