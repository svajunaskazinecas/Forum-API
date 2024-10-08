import express from "express";
const router = express.Router();

import { signUp, login, validateUser } from "../controller/signIn.js";
import {
  CreateNewQuestion,
  GetAllQuestions,
  deleteQuestion,
  GetQuestionsByTag,
  GetQuestionByUUID,
  GetTagsCount,
} from "../controller/question.js";
import { auth } from "../middleware/auth.js";
import {
  createAnswer,
  getAnswersByQuestionUUID,
  deleteAnswerByUUID,
  voteAnswer,
} from "../controller/answer.js";

router.post("/register", signUp);
router.post("/login", login);
router.get("/login/validate", validateUser);
router.post("/question", auth, CreateNewQuestion);
router.get("/question", GetAllQuestions);
router.get("/questions", GetQuestionsByTag);
router.get("/tags/count", GetTagsCount);
router.get("/questions/:uuid", GetQuestionByUUID);
router.delete("/question/:uuid", auth, deleteQuestion);
router.post("/question/:uuid/answers", auth, createAnswer);
router.get("/question/:uuid/answers", getAnswersByQuestionUUID);
router.delete("/answer/:uuid", auth, deleteAnswerByUUID);
router.post("/answers/:uuid/vote", auth, voteAnswer);

export default router;
