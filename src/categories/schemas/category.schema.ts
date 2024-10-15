// src/schemas/category.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import slugify from 'slugify';

@Schema({ timestamps: true })
export class Category extends Document {
  @Prop({ required: true, unique: true, trim: true })
  category_name: string;

  @Prop()
  description: string;

  @Prop({ unique: true })
  category_slug: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.pre('save', function (next) {
  if (this.isModified('category_name')) {
    this.category_slug = slugify(this.category_name, { lower: true });
  }
  next();
});
