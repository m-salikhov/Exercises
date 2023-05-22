import { Router } from "express";

const userRouter = Router();

userRouter.post("/login", (req, res) => {
  res.send(["LOGIN"]);
});

userRouter.post("/register", (req, res) => {
  res.send(["REGISTER"]);
});

export default userRouter;
