import express from 'express';

class SessionRouter {
  constructor(sessionController) {
    this.sessionController = sessionController;
  }

  getRouter() {
    const router = express.Router();
    router.route('/:id').get(this.sessionController.getSessionById);
    router.route('/:id').delete(this.sessionController.deleteSessionById);
    router.route('/').get(this.sessionController.getSession);
    router.route('/').post(this.sessionController.createSession);
    router.route('/').put(this.sessionController.updateSession);
    router.route('/').delete(this.sessionController.deleteSession);
    return router;
  }
}

export default SessionRouter;
