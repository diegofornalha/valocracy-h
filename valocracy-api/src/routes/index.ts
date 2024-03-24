import { Router } from 'express';
import authRouter from './auth.routes';
import userRouter from './user.routes';
import projectRouter from './project.routes';
import hotmartAccountRouter from './hotmart_account.route';
import registryRoute from './registry.route';
import discordRoute from './discord.routes';
import metamaskRoute from './user_metamask.routes';
import externalAccessRoute from './external_access.routes';
import effortRarityRouter from './effort_nature.routes';
import effortNatureRouter from './effort_rarity.routes';
import effortRouter from './effort.routes';
import economyRouter from './economy.routes';
import governanceRouter from './governance.routes';
const apiRouter = Router();

apiRouter.use('/auth', authRouter);

apiRouter.use('/user', userRouter);

apiRouter.use('/project', projectRouter);

apiRouter.use('/hotmart', hotmartAccountRouter);

apiRouter.use('/registry', registryRoute);

apiRouter.use('/discord', discordRoute);

apiRouter.use('/metamask', metamaskRoute);

apiRouter.use('/external_access', externalAccessRoute);

apiRouter.use('/effort_rarity', effortRarityRouter);

apiRouter.use('/effort_nature', effortNatureRouter);

apiRouter.use('/effort', effortRouter);

apiRouter.use('/economy', economyRouter);

apiRouter.use('/governance', governanceRouter);

export default apiRouter;