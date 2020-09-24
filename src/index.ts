import express = require('express');

const app = express()
const port = 3000

export const process = () => "Hello World";

app.get('/', (req: express.Request, res: express.Response) => {
  res.send('Hello World!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
