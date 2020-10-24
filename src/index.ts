/* Load environment configuration */
import dotenv from "dotenv";
dotenv.config();

/* Import express for web interface */
import express from "express";
import bodyParser from "body-parser";

/* Import application definitions */
import { Environment as Env } from "./lib/Environment";
import { CircularCache } from "./lib/CircularCache";

import { UserController } from "./controllers/UserController";
import { UserRepository } from "./data/repositories/UserRepository";
import { UserService } from "./services/UserService";
import { UserEntity } from "./data/entities/user/UserEntity";

import { AuthController } from "./controllers/AuthController";
import { AuthService } from "./services/AuthService";
import { AuthMiddleware } from "./middlewares/AuthMiddleware";

import { Connection } from "./data/repositories/mysql/Connection";
import { Logger } from "./lib/Logger";
import { UserMiddleware } from "./middlewares/UserMiddleware";

const app = express();
app.use(bodyParser.json());

/** Init application definitions */
const mysqlConnection = new Connection(
    Env.getMysqlHost(),
    Env.getMysqlUser(),
    Env.getMysqlPassword(),
    Env.getMysqlSchema(),
    Env.getMysqlConnectionPoolLimit(),
)
const userRepository = new UserRepository(mysqlConnection);

const userService = new UserService(userRepository);
const authService = new AuthService(Env.getJwtSecret(), userRepository, new CircularCache<UserEntity>(10));

const usercontroller = new UserController(userService);
const authController = new AuthController(authService);

const userMiddleware = new UserMiddleware();
const authMiddleware = new AuthMiddleware(authService);

/** Define routes mapping */
app.get("/users", usercontroller.getUsers.bind(usercontroller));
app.get("/users/:id",
    userMiddleware.verifyGetUserParams.bind(userMiddleware),
    usercontroller.getUser.bind(usercontroller));
app.post("/users", 
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyCreateUserParams.bind(userMiddleware),
    usercontroller.createUser.bind(usercontroller));
app.put("/users/:id", authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyUpdateUserParams.bind(userMiddleware),
    usercontroller.updateUser.bind(usercontroller));
app.delete("/users/:id",
    authMiddleware.verify.bind(authMiddleware),
    userMiddleware.verifyDeleteUserParams.bind(userMiddleware),
    usercontroller.deleteUser.bind(usercontroller));

app.post("/auth", authController.authenticateUser.bind(authController));

/** Listen for requests */
app.listen(Env.getPort(), () => {
    const logger = new Logger("index");
    logger.info(`App listening at ${Env.getPort()}`);
    logger.info(`App running in ${Env.getLocation()} environment`);
});
