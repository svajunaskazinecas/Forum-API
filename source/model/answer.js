import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const answerSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  answer_text: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  gained_likes_number: {
    type: Number,
    default: 0,
  },
  question_id: {
    type: String,
    required: true,
  },
});

const Answer = mongoose.model("Answer", answerSchema);

export default Answer;
