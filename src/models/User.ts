import { Schema, model } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface User {
  id: string;
  nomer: string;
  password: string;
  createdAt:Date
}

const UserSchema = new Schema<User>({
  id: { type: String, default: uuidv4 },
  nomer: { type: String, required: true, unique: true,match:/^\+993*/ },
  password: { type: String, required: true },
  createdAt:{type:Date,default:Date.now}
});

export default model<User>("User", UserSchema);