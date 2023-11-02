import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/user.model';
import { IBlog } from './blog.interface';

@Schema()
export class Blog implements IBlog {
  @Prop({
    type: Types.ObjectId,
    required: true,
    autopopulate: true,
    ref: User.name,
  })
  author: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop([String])
  tags: string[];

  @Prop({ required: true })
  image: string;

  @Prop({ default: 5 })
  min_read: number;

  @Prop({ default: true })
  is_published: boolean;

  @Prop({ default: false, select: false, required: false })
  deleted: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
