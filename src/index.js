import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import app from './app.js';
import db from './mongo/db.js';
import UserRouter from './components/user/user.router.js';
import swaggerDocument from './swagger-output.json' assert { type: "json" };
import LensRouter from "./components/lens/lens.router.js";
import SessionRouter from "./components/session/session.router.js";


dotenv.config();

const port = process.env.PORT || 4200; // example usage of environment variable

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  db.admin().ping().then(r => console.log("DB connected"));
});

app.use('/users', UserRouter);

app.use('/lens', LensRouter);
app.use('/session', SessionRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
