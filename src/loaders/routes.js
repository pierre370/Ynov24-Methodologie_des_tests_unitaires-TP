import userModule from '../components/user/user.module.js';
import lensModule from "../components/lens/lens.module.js";
import sessionModule from "../components/session/session.module.js";

export default (app) => {
  app.use('/users', userModule.router);
  app.use('/lens', lensModule.router);
  app.use('/session', sessionModule.router);
};
