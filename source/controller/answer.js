import Answer from "../model/answer.js";
import Question from "../model/question.js";

export const createAnswer = async (req, res) => {
  const { answer_text } = req.body;
  const { uuid } = req.params;
  const user_id = req.userId;

  if (!answer_text) {
    return res.status(400).json({ message: "Answer text is required." });
  }

  try {
    const question = await Question.findOne({ uuid });
    if (!question) {
      return res.status(404).json({ message: "Question not found." });
    }

    const newAnswer = new Answer({
      answer_text,
      question_id: question.uuid,
      user_id,
    });

    await newAnswer.save();

    return res.status(201).json({
      message: "Answer created successfully!",
      answer: newAnswer,
    });
  } catch (error) {
    console.error("Error creating answer:", error);
    return res.status(500).json({
      message: "An error occurred while creating the answer.",
      error: error.message,
    });
  }
};

export const getAnswersByQuestionUUID = async (req, res) => {
  const { uuid } = req.params;

  try {
    const answers = await Answer.find({ question_id: uuid });

    if (!answers || answers.length === 0) {
      return res
        .status(404)
        .json({ message: "No answers found for this question." });
    }

    return res.status(200).json({
      message: "Answers retrieved successfully!",
      answers,
    });
  } catch (error) {
    console.error("Error retrieving answers:", error);
    return res.status(500).json({
      message: "An error occurred while retrieving the answers.",
      error: error.message,
    });
  }
};

export const deleteAnswerByUUID = async (req, res) => {
  const { uuid } = req.params;

  try {
    const deletedAnswer = await Answer.findOneAndDelete({ uuid });

    if (!deletedAnswer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    return res.status(200).json({
      message: "Answer deleted successfully!",
      deletedAnswer,
    });
  } catch (error) {
    console.error("Error deleting answer:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the answer.",
      error: error.message,
    });
  }
};

export const voteAnswer = async (req, res) => {
  const { uuid } = req.params;
  const { voteType } = req.body;

  try {
    const answer = await Answer.findOne({ uuid });

    if (!answer) {
      return res.status(404).json({ message: "Answer not found." });
    }

    if (voteType === "upvote") {
      answer.gained_likes_number += 1;
    } else if (voteType === "downvote") {
      answer.gained_likes_number = Math.max(0, answer.gained_likes_number - 1);
    }

    await answer.save();

    return res
      .status(200)
      .json({ message: "Vote recorded successfully!", answer });
  } catch (error) {
    console.error("Error voting answer:", error);
    return res.status(500).json({
      message: "An error occurred while voting.",
      error: error.message,
    });
  }
};
