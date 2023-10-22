import { Types } from 'mongoose';

export interface IBlog {
  _id?: Types.ObjectId | string;
  title: string;
  content: string;
  author: Types.ObjectId | string;
  tags: string[];
  image: string;
  min_read: string;
  is_published: boolean;
  deleted?: boolean;
}
