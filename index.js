import express from "express";
import mongoose from "mongoose";
import "dotenv/config";
import forumRouter from "./source/route/forum.js";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log(err);
  });

app.use(forumRouter);

app.listen(process.env.PORT, () => {
  console.log(`Your app is started on port ${process.env.PORT}`);
});
