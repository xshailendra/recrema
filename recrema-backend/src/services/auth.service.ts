import { User, IUser } from '../models/User';
import bcrypt from 'bcryptjs';

export class AuthService {
  static async login(identifier: string, password: string): Promise<IUser | null> {
    // Check if identifier is email or clientCode
    const isEmail = identifier.includes('@');
    
    const query = isEmail 
      ? { email: identifier.toLowerCase() }
      : { clientCode: identifier };

    const user = await User.findOne(query);

    if (!user) {
      return null;
    }

    if (!user.isActive) return null;

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return null;
    }

    return user;
  }
}
