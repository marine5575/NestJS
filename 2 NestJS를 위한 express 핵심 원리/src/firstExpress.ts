import * as express from "express";

const app: express.Express = express();
const port: number = 3000;

app.get("/test", (req: express.Request, res: express.Response) => {
  console.log(req);

  //   res.send({ name: "jennie", age: 25, friends: ["ss", "ys"] });
  res.send({ hello: "world!!" });
});

app.post("/test", (req, res) => {
  res.send({ person: "jennie" });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
