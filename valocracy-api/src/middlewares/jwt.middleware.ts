import env from '@/config';
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtType } from '@/interfaces/types/jwt.type';
import { Logger } from '@/services/LoggerService';

const jwtSecret = env.JWT_SECRET || '';

class JwtMiddleware {
	verifyRefreshBodyField(req: Request, res: Response, next: NextFunction) {
		if (req.body && req.body.refreshToken) {
			return next();
		} else {
			return res
				.status(400)
				.send({ errors: ['Missing required field: refreshToken.'] });
		}
	}

	// Validate expiration time
	validJWTNeeded(req: Request, res: Response, next: NextFunction) {
		try {
			// eslint-disable-next-line dot-notation
			if (req.headers['authorization']) {
				try {
					// eslint-disable-next-line dot-notation
					const authorization = req.headers['authorization'].split(' ');
					if (authorization[0] !== 'Bearer') {
						return res.status(401).send({ message: 'Prefixo do token incorreto' });
					} else {
						res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as JwtType;
						next();
					}
				} catch (err) {
					return res.status(403).send({ message: err });
				}
			} else {
				return res.status(401).send({ message: 'Token nao informado' });
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			Logger.getInstance().error('JWTMiddleware', err?.message || err);
			return res.status(500).send({ message: 'Erro desconhecido ao validor token de acesso' });
		}
	}

	validJWTOrPassphraseNeeded(req: Request, res: Response, next: NextFunction) {
		try {
			// eslint-disable-next-line dot-notation
			if (req.headers['authorization']) {
				try {
					// eslint-disable-next-line dot-notation
					const authorization = req.headers['authorization'].split(' ');
					if (authorization[0] !== 'Bearer') {
						return res.status(401).send();
					} else {
						if (
							authorization[1] ===
							'9b5ebb16f0220af9f91b2cd5fbda0e31a0fc349f3336507b65d088a6566be178'
						) {
							next();
						} else {
							res.locals.jwt = jwt.verify(authorization[1], jwtSecret) as JwtType;
							next();
						}
					}
				} catch (err) {
					return res.status(403).send();
				}
			} else {
				return res.status(401).send();
			}
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (err: any) {
			Logger.getInstance().error('JWTMiddleware', err?.message || err);
			return res.status(500).send({ message: 'Erro desconhecido ao validor token de acesso' });
		}
	}
}

export default new JwtMiddleware();
