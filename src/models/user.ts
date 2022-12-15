import mongoose from 'mongoose';

export interface UserType {
  name: string;
  adresse: string;
  birthDate: string;
  email: string;
}

export const UserSchema = new mongoose.Schema<UserType>({
  name: { type: String, required: true },
  adresse: { type: String, required: true },
  birthDate: { type: String, required: true },
  email: { type: String, required: true, unique: true },
});

export const User = mongoose.model('User', UserSchema);

export default User;
