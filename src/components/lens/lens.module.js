import LensController from './lens.controller.js';
import LensService from './lens.service.js';
import LensRouter from './lens.router.js';
import LensRepository from './lens.repository.js';

const lensRepository = new LensRepository();
const lensService = new LensService(lensRepository);
const lensController = new LensController(lensService);
const lensRouter = new LensRouter(lensController);

export default {
  service: lensService,
  controller: lensController,
  router: lensRouter.getRouter(),
  repository: lensRepository
};
