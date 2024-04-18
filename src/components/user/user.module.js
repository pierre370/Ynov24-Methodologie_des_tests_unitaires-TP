import UserController from './user.controller.js';
import UserService from './user.service.js';
import UserRouter from './user.router.js';
import UserRepository from "./user.repository.js";

const userRepository = new UserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);
const userRouter = new UserRouter(userController);

export default {
  service: userService,
  controller: userController,
  router: userRouter.getRouter(),
  repository: userRepository
};
