import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface I_UserDocument extends mongoose.Document {
    email: string;
    name: string;
    authentication: {
        password: string;
        salt: string;
        sessionToken: string;
    };
    role: 'admin' | 'user' | undefined;
}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, unique: true},
    name: { type: String, required: true, unique: true},
    authentication: {
        password: { type: String, required: true, minlength: 6, select: false },
        salt: { type: String, select: false },
        sessionToken: { type: String, select: false }
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
}); 

UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
      user.authentication.password = await bcrypt.hash(user.authentication.password, saltRounds);
    }
    next();
});

export const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: string) => {
   return UserModel.findOne({'authentication.sessionToken': sessionToken});
};

export const getUserById = (id: string) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({ _id: id});

export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate({ _id: id}, values);        