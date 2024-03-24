/* eslint-disable indent */
import Controller from '@/controllers/Controller';

const getErrorMessage = (label: string, info: string = '') => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const errorMessages: any = {
		featureNotImplemented: 'Funcionalidade não implementada ainda.',
		emptyBody: 'Requisição vazia encontrada',
		registryNotFound: `Registro de ${info} não encontrado.`,
		missingField: `O campo ${info} não foi informado!.`,
		missingData: `O dado ${info} não foi informado!.`,

		base64ImageMissingData: 'A imagem parece estar faltando dados.',
		base64ImgMissingExtension: 'Imagem não contem extensão',

		discordUserDataNotFound: 'Não foi possivel retornar as informações de usuário do discord',
		userAlreadyExist: 'Nome de usuário já em uso.',
		dataAlreadyCadastred: `${info} já cadastrado.`,
		projectUserAlreadyExist: 'Nome de usuário já em uso.',
		wrongCredential: 'Nome de usuário e/ou senha incorreto.',
		usernameDoestExist: 'Nome de usuário não existe.',
		invalidLoginCredentials: 'Invalid email and/or password',
		emailNotCadastred: 'Email não cadastrado.',
		emailNotInList: 'Email não esta listado em nenhum dos acessos.',
		emailAlreadyExist: 'Email já em uso.',
		invalidTypeOfAuth: 'Tipo de autenticação invalida para a operação',

		solicitedRegistryIsNotYours: 'Registro solicitado para operação não pertence ao mesmo.',
		userActionNotPermitted: 'Ação não condiz com Nível de permicao do usuário.',

		noDatabaseConnection: 'Nenhuma conexão com banco encontrada.',
		databaseConnectionFailed: 'Falha ao conectar com o banco de dados.',
		databaseConnectionPending: 'Conexão com o banco de dados pendente.',

		missingValidationCodeData: 'Código para validação não encontrado.',
		emailNotInPrivateList: 'Email não esta contido na lista de acesso antecipado.',
		invalidEmailCode: 'Código de email não é valido.',
		emailCodeExpired: 'Código de email expirado.',
		emailCreateError: 'Ouve um erro ao criar o código de segurança.',
		validoCheckCode: `Erro ao validar código: ${info}`,
		missConfiguredService: `Erro ao efetuar envio ${info}.`,

		dataSizeIsIncorrect: `${info} esta incorreto, motivo: Tamanho!.`,
		isNotAJSON: 'Resposta retornada não condiz com um json',
		unrecognizedErrorFrom: `Erro desconhecido de ${label}!.`,
		noValidDataFound: 'Nenhum dado valido encontrado para a operação.',
		invalidLoginFormat: 'Formato para login não informado ou inválido.',
		walletNotFound: 'Carteira não encontrada.',

		// IPFS
		IPFSServiceError: `Error ao subir imagem para o servidor IPFS: ${info}`,

		// Effort
		efforImageCantBeChanged: 'Imagem do esforço não pode ser alterada',

		// Wallet
		missingUserWalletConnectin: 'Carteira do usuário não cadastrada.',

		// Governance
		noGovernancePowerToVote: 'Não ha poder de governança, consiga um NFT de esforço para poder votar.'
	};

	Controller.errorStatusCode = getErrorStatusCode(label);

	return errorMessages[label] || '';
};

const getErrorStatusCode = (label: string) => {

	switch (label) {
		case 'invalidLoginCredentials':
		case 'wrongCredential':
		case 'missingField':
		case 'dataAlreadyCadastred':
		case 'base64ImageMissingData':
		case 'base64ImgMissingExtension':
			return 400;
		case 'userActionNotPermitted':
			return 403;
		case 'missingData':
		case 'userAlreadyExist':
		case 'registryNotFound':
		case 'noDatabaseConnection':
		case 'isNotAJSON':
		case 'unrecognizedErrorFrom':
			return 500;
		default:
			return 500;
	}
};

const getSuccessMessage = (label: string, info: string = '') => {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const successMessages: any = {
		update: `${info} atualizado com sucesso!.`,
		insert: `${info} inserido com sucesso!.`,
		delete: `${info} removido com sucesso!.`,
		emailSended: 'Email enviado com sucesso!.',
		synced: `${info} sincronizada com sucesso!`,
		messageSended: 'Mensagem enviada com sucesso!.'
	};

	return successMessages[label] || '';
};

export {
	getErrorMessage,
	getSuccessMessage,
	getErrorStatusCode
};