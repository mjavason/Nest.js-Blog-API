import { Types } from 'mongoose';

export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
}

export interface IUser {
  _id?: string | Types.ObjectId;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  deleted?: boolean;
}
