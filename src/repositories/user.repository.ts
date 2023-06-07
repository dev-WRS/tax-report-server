import { I_UserDocument, UserModel } from '../models/authentication/user.model';

class UserRepository {
    public async findAll(): Promise<I_UserDocument[]> {
        const users = await UserModel.find({}).select('-password');
        return users;
    }

    public async findById(id: string): Promise<I_UserDocument | null> {
        const user = await UserModel.findById(id).select('-password');
        return user;
    }

    public async findByEmail(email: string): Promise<I_UserDocument | null> {
        const user = await UserModel.findOne({ email }).select('-password');
        return user;
    }

    public async findByIdWithPassword(id: string): Promise<I_UserDocument | null> {
        const user = await UserModel.findById(id);
        return user;
    }

    public async findByEmailWithPassword(email: string): Promise<I_UserDocument | null> {
        const user = await UserModel.findOne({ email });
        return user;
    }

    public async createUser(user: any): Promise<I_UserDocument | null> {
        const newUser = new UserModel({
          name: user.name,
          email: user.email,
          password: user.password,
          role: user.role,
        });
        const savedUser = await newUser.save();
        return savedUser;
    }

    public async updatePassword(
        id: string,
        password: string,
      ): Promise<I_UserDocument | null> {
        const user = await UserModel.findByIdAndUpdate(
          id,
          { password },
          { new: true },
        ).select('-password');
        return user;
    }

    public async deleteUser(id: string): Promise<I_UserDocument | null> {
        const user = await UserModel.findByIdAndDelete(id);
        return user;
      }
}

export default UserRepository;