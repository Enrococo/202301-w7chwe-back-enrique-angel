import mongoose, { Schema } from 'mongoose';

export interface User {
  id: string;
  email: string;
  password: string;
  profileImg: string;
  follower: User[];
}

const userSchema = new Schema<User>({
  id: String,
  email: String,
  password: String,
  profileImg: String,
  follower: [{ type: Schema.Types.ObjectId, ref: 'User' }],
});

export const UserModel = mongoose.model<User>('User', userSchema, 'users');
