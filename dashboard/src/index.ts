import express from "express";
import cookieParser from "cookie-parser";
import { userRouter } from "./users/users.js";

const port = 8000;
const app = express();

app.use(cookieParser());

app.get("/test", (req, res) => {
  res.send(["hello world!"]);
});

app.use("/users", userRouter);

app.listen(port, () => {
  console.log(`server on ${port}`);
});
