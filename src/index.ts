import express from "express";
import { Environment } from "./Environment";
import dotenv from "dotenv";

dotenv.config();

const app = express()
const port = 3000

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`App listening at ${port}`);
  console.log(`App running in ${Environment.getLocation()} environment`);
})
