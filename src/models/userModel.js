import { Schema, model } from 'mongoose';

const usersSchema = new Schema({
  username: { type: String, required: true, unique: true }, 
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

const User =  model('User', usersSchema);

export default User;