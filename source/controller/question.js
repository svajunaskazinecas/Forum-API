import Question from "../model/question.js";
import Answer from "../model/answer.js";
import { v4 as uuidv4 } from "uuid";

export const CreateNewQuestion = async (req, res) => {
  try {
    const { question_title, question_text, tags } = req.body;

    if (!question_title || !question_text) {
      return res.status(400).json({ message: "Title and text are required." });
    }

    const userUUID = req.userId;

    const newQuestion = new Question({
      uuid: uuidv4(),
      question_title,
      question_text,
      user_id: userUUID,
      tags,
    });

    await newQuestion.save();

    return res.status(201).json({
      message: "Question created successfully!",
      question: newQuestion,
    });
  } catch (error) {
    console.error("Error creating question:", error);
    return res.status(500).json({
      message: "An error occurred while creating the question.",
      error: error.message,
    });
  }
};

export const GetAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.status(200).json(questions);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

export const deleteQuestion = async (req, res) => {
  const { uuid } = req.params;

  try {
    const question = await Question.findOne({ uuid });

    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const result = await Answer.deleteMany({ question_id: question.uuid });
    console.log("Deleted answers:", result);

    await Question.deleteOne({ uuid });

    return res.status(200).json({
      message: "Question and its answers deleted successfully!",
    });
  } catch (error) {
    console.error("Error deleting question:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the question.",
      error: error.message,
    });
  }
};

export const GetQuestionsByTag = async (req, res) => {
  const tag = req.query.tag;

  if (!tag) {
    return res.status(400).json({ message: "Tag is required" });
  }

  try {
    const questions = await Question.find({ tags: tag });

    if (questions.length === 0) {
      return res
        .status(404)
        .json({ message: "No questions found for this tag" });
    }

    return res.status(200).json({
      message: `${questions.length} question(s) found for the tag: ${tag}`,
      questions,
    });
  } catch (error) {
    console.error("Error fetching questions by tag:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving questions",
      error: error.message,
    });
  }
};

export const GetQuestionByUUID = async (req, res) => {
  const { uuid } = req.params;

  try {
    const question = await Question.findOne({ uuid });

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    return res.status(200).json(question);
  } catch (error) {
    console.error("Error fetching question:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
