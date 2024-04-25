import express from 'express';

class UserRouter {
  // #swagger.tags = ['USER']
  constructor(userController) {
    this.userController = userController;
  }

  getRouter() {
    const router = express.Router();
    router.route('/:id').get(this.userController.getUserById);
    router.route('/:id').delete(this.userController.deleteUserById);
    router.route('/').get(this.userController.getUsers);
    router.route('/').post(this.userController.createUser);
    router.route('/').put(this.userController.updateUser);
    router.route('/').delete(this.userController.deleteUsers);
    router.route('/login').post(this.userController.login);
    return router;
  }
}

export default UserRouter;
