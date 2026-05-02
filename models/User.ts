import { Schema, model, models } from 'mongoose';

export type UserDocument = {
  username: string;
  email: string;
  password: string;
};

const userSchema = new Schema<UserDocument>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

export const User = models.User || model<UserDocument>('User', userSchema);
