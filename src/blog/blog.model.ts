import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, HydratedDocument, Types } from 'mongoose';
import { User } from 'src/user/user.model';

export type BlogDocument = HydratedDocument<Blog>;

@Schema()
export class Blog {
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

  @Prop({ default: '5 minutes' })
  min_read: string;

  @Prop({ default: true })
  is_published: boolean;

  @Prop({ default: false, select: false, required: false })
  deleted: boolean;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
