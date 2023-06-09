import mongoose from 'mongoose';

export enum Role {
    ADMIN = 'admin',
    USER = 'user',
    SUPER_ADMIN = 'super_admin'
}

export enum UserStatus {
    VERIFIED = 'verified',
    UNVERIFIED = 'unverified',
    DISABLED = 'disabled'
}

export interface I_UserDocument extends mongoose.Document {
    email: string;
    fullName: string;
    userName: string;
    authentication: {
        password: string;
        sessionToken: string;
        resetToken: string;
    };
    role: Role;
    status: UserStatus;
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: mongoose.Schema<I_UserDocument> = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, unique: true},
    fullName: { type: String, required: true },
    userName: { type: String, required: true, unique: true},
    authentication: {
        password: { type: String, required: true, minlength: 6, select: false },
        sessionToken: { type: String, select: false },
        resetToken: { type: String, select: false }
    },
    role: { type: String, enum: Role, default: 'user' },
    status: { type: String, enum: UserStatus, default: 'unverified' },
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

export const getUserByResetToken = (resetToken: string) => {
    const user = UserModel.findOne({'authentication.resetToken': resetToken});
    return user;
  };

export const getUserById = (id: string) => UserModel.findById(id);

export const createUser = (values: Record<string, any>) => new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete({ _id: id});

export const updateUserById = (id: string, values: Record<string, any>) => UserModel.findByIdAndUpdate({ _id: id}, values);        