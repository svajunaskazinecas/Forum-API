import mongoose from "mongoose";
import { v4 as uuidv4 } from "uuid";

const questionSchema = mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  question_title: { type: String, required: true },
  question_text: { type: String, required: true },
  date: { type: Date, default: Date.now },
  user_id: { type: String, required: true },
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
