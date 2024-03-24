import { Request, Response } from 'express';

import { getErrorMessage, getSuccessMessage } from '@/helpers/response_collection';
import Controller from './Controller';
import { ProjectInsertInterface, ProjectInterface } from '@/interfaces/ProjectInterface';
import { decryptAES } from '@/helpers/util';
import env from '@/config';
import { isUserAdm } from '@/helpers/permission_system';
import ProjectService from '@/services/ProjectService';

class ProjectController extends Controller {
	private service: ProjectService;

	constructor() {
		super();
		this.service = new ProjectService();
	}

	private validateEntries(userId: number, project: ProjectInterface) {
		if (!userId) throw Error(getErrorMessage('invalidTypeOfAuth'));
		if (userId !== project.user_account_id) throw Error(getErrorMessage('solicitedRegistryIsNotYours'));
	}

	async fetch(req: Request, res: Response) {
		try {
			const id: number = parseInt(req.params.id);
			const userId: number = Number(res.locals.jwt.user_id);
			const project: ProjectInterface | null = await this.service.fetch(id);

			if (!project) throw Error(getErrorMessage('registryNotFound', 'Projeto'));

			this.validateEntries(userId, project);
			project.organization_id = decryptAES(project.organization_id, env);
			project.api_key = decryptAES(project.api_key, env);

			return this.sendSuccessResponse(res, { content: project });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ApplicationKey');
		}
	}

	async fetchAll(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const projects: Array<ProjectInterface> = await this.service.fetchAllOfUser(userId);

			return this.sendSuccessResponse(res, { content: projects });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ApplicationKey');
		}
	}

	async create(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const body: ProjectInsertInterface = req.body;
			const _isUserAdm = await isUserAdm(userId);

			if (!_isUserAdm) throw Error(getErrorMessage('accountTypeNoPmt'));
			body.user_account_id = userId;

			await this.service.create(body);

			return this.sendSuccessResponse(res, { message: getSuccessMessage('insert', 'Projeto') });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ProjectAccountController');
		}
	}

	async update(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const paramProjectId = Number(req.params.id);
			const project: ProjectInterface | null = await this.service.fetch(paramProjectId);

			if (!project) throw Error(getErrorMessage('registryNotFound', 'Projeto'));
			this.validateEntries(userId, project);
			const body: ProjectInterface = req.body;

			await this.service.update(body, paramProjectId);

			return this.sendSuccessResponse(res, { message: getSuccessMessage('update', 'Projeto') });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ProjectAccountController');
		}
	}

	async remove(req: Request, res: Response) {
		try {
			const userId: number = Number(res.locals.jwt.user_id);
			const paramProjectId = Number(req.params.id);
			const project: ProjectInterface | null = await this.service.fetch(paramProjectId);

			if (!project) throw Error(getErrorMessage('registryNotFound', 'Projeto'));
			this.validateEntries(userId, project);

			await this.service.remove(paramProjectId);
			return this.sendSuccessResponse(res, { message: getSuccessMessage('delete', 'Projeto') });
		} catch (err) {
			this.sendErrorMessage(res, err, 'ProjectAccountController');
		}
	}
}

export default ProjectController;