/* Import express for web interface */
import express from "express";
import cors from "cors";

/* Import application definitions */
import { RequestMiddleware } from "./middlewares/RequestMiddleware";

import { UserMiddleware } from "./middlewares/UserMiddleware";
import { UserController } from "./controllers/UserController";
import { UserService } from "./services/UserService";
import { UserRepository } from "./data/repositories/UserRepository";
import { UserEntity } from "./data/entities/UserEntity";

import { AuthMiddleware } from "./middlewares/AuthMiddleware";
import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./services/AuthService";

import { HealthService } from "./services/HealthService";
import { HealthController } from "./controllers/HealthController";

import { Environment as Env } from "./lib/Environment";
import { CircularCache } from "./lib/CircularCache";
import { Connection } from "./data/connection/mysql/Connection";
import { Logger } from "./lib/Logger";

/** Display environment info */
const logger = new Logger("Main");

logger.info("Location: " + Env.getLocation());
logger.info("LogLevel: " + Env.getLogLevel());
logger.info("Port: " + Env.getPort());
logger.info("MysqlHost: " + Env.getMysqlHost());
logger.info("MysqlSocketPath: " + Env.getMysqlSocketPath());
logger.info("MysqlSchema: " + Env.getMysqlSchema());
logger.info("isProd: " + Env.isProd());
logger.info("isStaging: " + Env.isStaging());
logger.info("isDev: " + Env.isDev());

/** Init application definitions */
const mysqlConnection = new Connection(new Logger(Connection.name));
const userRepository = new UserRepository(mysqlConnection, new Logger(UserRepository.name));

const healthService = new HealthService(
    [{ label: "mysql", reporter: mysqlConnection}],
    new Logger(HealthService.name),
);
const userService = new UserService(userRepository, new Logger(UserService.name));
const authService = new AuthService(
    Env.getJwtSecret(),
    userRepository,
    new CircularCache<UserEntity>(10),
    new Logger(AuthService.name),
);

const healthController = new HealthController(healthService, new Logger(HealthController.name));
const usercontroller = new UserController(userService, new Logger(UserController.name));
const authController = new AuthController(authService, new Logger(AuthController.name));

const userMiddleware = new UserMiddleware(new Logger(UserMiddleware.name));
const authMiddleware = new AuthMiddleware(authService, new Logger(AuthMiddleware.name));

const requestMiddleware = new RequestMiddleware(new Logger(RequestMiddleware.name));

/** Register application global middlewares */
const app = express();

app.use(requestMiddleware.log.bind(requestMiddleware));
app.use(express.json());
app.use(requestMiddleware.handleErrors.bind(requestMiddleware));
app.use(cors());

/** Register application routes and specific middlewares */
app.get("/users", usercontroller.getUsers.bind(usercontroller));
app.get("/users/:id",
    userMiddleware.verifyGetUserParams.bind(userMiddleware),
    usercontroller.getUser.bind(usercontroller));
app.post("/users",
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyCreateUserParams.bind(userMiddleware),
    usercontroller.createUser.bind(usercontroller));
app.put("/users/:id",
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyUpdateUserParams.bind(userMiddleware),
    usercontroller.updateUser.bind(usercontroller));
app.delete("/users/:id",
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyDeleteUserParams.bind(userMiddleware),
    usercontroller.deleteUser.bind(usercontroller));

app.get("/health",
    authMiddleware.verify.bind(authMiddleware),
    healthController.getReport.bind(healthController));
app.post("/auth", authController.authenticateUser.bind(authController));

/** Listen for requests */
app.listen(Env.getPort(), () => {
    logger.info(`App listening at port ${Env.getPort()}`);
    logger.info(`App running in ${Env.getLocation()} environment`);
});
