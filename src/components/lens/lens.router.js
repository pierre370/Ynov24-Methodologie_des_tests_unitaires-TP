import express from 'express';

class LensRouter {
  constructor(lensController) {
    this.lensController = lensController;
  }

  getRouter() {
    const router = express.Router();
    router.route('/:id').get(this.lensController.getLensById);
    router.route('/:id').delete(this.lensController.deleteLensById);
    router.route('/').get(this.lensController.getLens);
    router.route('/').post(this.lensController.createLens);
    router.route('/').put(this.lensController.updateLens);
    router.route('/').delete(this.lensController.deleteLens);
    return router;
  }
}

export default LensRouter;
