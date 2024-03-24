import { DiscordUserInterface } from '@/interfaces/DiscordInterface';
import { UserAccountInterface } from '@/interfaces/UserAccountInterface';
import DiscordService from '@/services/DiscordService';
import UserService from '@/services/UserService';

export enum PermissionSystemEnum {
	ADMIN = 'ADM',
	USER = 'USR'
}

export enum DiscordPermissionEnum {
	ADMIN = 'ADMIN'
}

const isUserAdm = async (userId: number): Promise<boolean> => {
	const userService = new UserService();
	const discordService = new DiscordService();

	const [user, discordUser]: [UserAccountInterface | null, DiscordUserInterface | null] = await Promise.all([userService.fetch(userId), discordService.fetchByUserId(userId)]); 

	const isDiscordAdmin = Boolean(discordUser?.roles?.find((role) => {
		return role.name.toUpperCase() === DiscordPermissionEnum.ADMIN;
	}));

	return user?.acc_lvl === PermissionSystemEnum.ADMIN || isDiscordAdmin;
};

export {
	isUserAdm
}; 