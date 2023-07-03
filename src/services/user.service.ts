import { UserToUpdate } from '@interfaces/user.interface';
import { I_UserDocument, UserModel } from '@models/authentication/user.model';

export async function getUsersService(): Promise<I_UserDocument[]> {
    try {
        const users = await UserModel.find().select('-password -updatedAt').exec();
        return users;
    } catch (error) {
        throw error;
    }
}

export async function getUserService(userId: string): Promise<I_UserDocument> {
    try {
        const user = await UserModel.findById(userId).select('-password -updatedAt').exec();
        return user;
    } catch (error) {
        throw error;
    }
}

export async function deleteUserService(userId: string): Promise<boolean> {
    try {
        await UserModel.findByIdAndDelete({userId}).exec();
        return true;
    } catch (error) {
        throw error;
    }
}

export async function updateUserService(userId: string, userToUpdate: UserToUpdate) {
    try {
        const updatedUser = await UserModel.findById(userId).select('-password').exec();

        if (!updatedUser) {
            throw new Error('User not found');
        }
    
        updatedUser.fullName = userToUpdate.fullName;
        updatedUser.userName = userToUpdate.userName;
        updatedUser.role = userToUpdate.role;

        await updatedUser.save();
        return updatedUser;
    } catch (error) {
        throw error;
    }
}