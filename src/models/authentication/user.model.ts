import mongoose from 'mongoose';

export interface I_UserDocument extends mongoose.Document {
    email: string;
    fullName: string;
    userName: string;
    authentication: {
        password: string;
        sessionToken: string;
    };
    role: 'admin' | 'user' | undefined;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, unique: true},
    fullName: { type: String, required: true, unique: true},
    userName: { type: String, required: true, unique: true},
    authentication: {
        password: { type: String, required: true, minlength: 6, select: false },
        sessionToken: { type: String, select: false }
    },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    createdAt: Date,
    updatedAt: Date
}); 

export const UserModel = mongoose.model<I_UserDocument>('User', UserSchema);

export const getUsers = () => UserModel.find();

export const getUserByEmail = (email: string) => UserModel.findOne({ email });

export const getUserBySessionToken = (sessionToken: string) => {
  const user = UserModel.findOne({'authentication.sessionToken': sessionToken});
  return user;
};

export const getUserById = (id: string) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({ _id: id});

export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate({ _id: id}, values);        