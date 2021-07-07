/* Import express for web interface */
import express from 'express';
import cors from 'cors';

/* Import application definitions */
import { RequestMiddleware } from './middlewares/RequestMiddleware';

import { UserMiddleware } from './middlewares/UserMiddleware';
import { UserController } from './controllers/UserController';
import { BaseUserService } from './services/UserService';
import { BaseUserRepository } from './data/repositories/UserRepository';

import { AuthMiddleware } from './middlewares/AuthMiddleware';
import { AuthController } from './controllers/AuthController';
import { BaseAuthService } from './services/AuthService';

import { BaseHealthService } from './services/HealthService';
import { HealthController } from './controllers/HealthController';

import { Environment as Env } from './lib/Environment';
import { CircularCache } from './lib/CircularCache';
import { MySQLConnection } from './data/connection/mysql/Connection';
import { BaseLogger } from './lib/Logger';
import { User } from './data/entities/User';

/** Display environment info */
const logger = new BaseLogger('Main');

logger.info('Location: ' + Env.getLocation());
logger.info('LogLevel: ' + Env.getLogLevel());
logger.info('Port: ' + Env.getPort());
logger.info('MysqlHost: ' + Env.getMysqlHost());
logger.info('MysqlPort: ' + Env.getMysqlPort());
logger.info('MysqlSSLConnection: ' + Env.getMysqlSSLConnection());
logger.info('MysqlSocketPath: ' + Env.getMysqlSocketPath());
logger.info('MysqlSchema: ' + Env.getMysqlSchema());
logger.info('isProd: ' + Env.isProd());
logger.info('isStaging: ' + Env.isStaging());
logger.info('isDev: ' + Env.isDev());

/** Init application definitions */
const mysqlConnection = new MySQLConnection(new BaseLogger(MySQLConnection.name));
const userRepository = new BaseUserRepository(mysqlConnection, new BaseLogger(BaseUserRepository.name));

const healthService = new BaseHealthService(
    [{ label: 'mysql', reporter: mysqlConnection }],
    new BaseLogger(BaseHealthService.name),
);
const userService = new BaseUserService(userRepository, new BaseLogger(BaseUserService.name));
const authService = new BaseAuthService(
    Env.getJwtSecret(),
    userRepository,
    new CircularCache<User>(10),
    new BaseLogger(BaseAuthService.name),
);

const healthController = new HealthController(healthService, new BaseLogger(HealthController.name));
const usercontroller = new UserController(userService, new BaseLogger(UserController.name));
const authController = new AuthController(authService, new BaseLogger(AuthController.name));

const userMiddleware = new UserMiddleware(new BaseLogger(UserMiddleware.name));
const authMiddleware = new AuthMiddleware(authService, new BaseLogger(AuthMiddleware.name));

const requestMiddleware = new RequestMiddleware(new BaseLogger(RequestMiddleware.name));

/** Register application global middlewares */
const app = express();

app.use(requestMiddleware.log.bind(requestMiddleware));
app.use(cors());
app.use(express.json());
app.use(requestMiddleware.handleErrors.bind(requestMiddleware));

/** Register application routes and specific middlewares */
app.get('/users', usercontroller.getUsers.bind(usercontroller));
app.get('/users/:id',
    userMiddleware.verifyGetUserParams.bind(userMiddleware),
    usercontroller.getUser.bind(usercontroller));
app.post('/users',
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyCreateUserParams.bind(userMiddleware),
    usercontroller.createUser.bind(usercontroller));
app.put('/users/:id',
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyUpdateUserParams.bind(userMiddleware),
    usercontroller.updateUser.bind(usercontroller));
app.delete('/users/:id',
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyDeleteUserParams.bind(userMiddleware),
    usercontroller.deleteUser.bind(usercontroller));

app.get('/health',
    authMiddleware.verify.bind(authMiddleware),
    healthController.getReport.bind(healthController));

app.post('/auth',
    userMiddleware.verifyAuthenticateUserParams.bind(userMiddleware),
    authController.authenticateUser.bind(authController));

/** Listen for requests */
app.listen(Env.getPort(), () => {
    logger.info(`App listening at port ${Env.getPort()}`);
    logger.info(`App running in ${Env.getLocation()} environment`);
});
