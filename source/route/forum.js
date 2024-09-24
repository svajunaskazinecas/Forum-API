import express from "express";
const router = express.Router();

import { signUp, login } from "../controller/signIn.js";
import {
  CreateNewQuestion,
  GetAllQuestions,
  deleteQuestion,
} from "../controller/question.js";
import { auth } from "../middleware/auth.js";
import {
  createAnswer,
  getAnswersByQuestionUUID,
} from "../controller/answer.js";

router.post("/register", signUp);
router.post("/login", login);
router.post("/question", auth, CreateNewQuestion);
router.get("/questions", GetAllQuestions);
router.delete("/question/:uuid", auth, deleteQuestion);
router.post("/question/answer", createAnswer);
router.get("/question/:uuid/answers", getAnswersByQuestionUUID);

export default router;
