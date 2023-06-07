import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import ConstantNumber from "../../constants/number.constant";

export interface I_UserDocument extends mongoose.Document {
    email: string;
    name: string;
    password: string;
    role: 'admin' | 'user' | undefined;
}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
    email: { type: String, required: true, unique: true},
    name: { type: String, required: true, unique: true},
    password: { type: String, required: true, minlength: ConstantNumber.PASSWORD_MIN_LENGTH },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}); 

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.password = await bcrypt.hash(user.password, ConstantNumber.PASSWORD_MIN_LENGTH);
    }
    next();
});

export const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);