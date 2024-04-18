import app from "./app.js";
import dotenv from "dotenv";
import db from "./mongo/db.js";

dotenv.config();

const port = process.env.PORT || 4200; // example usage of environment variable

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  db.admin().ping().then(r => console.log("DB connected"));
});
