// src/schemas/product.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import slugify from 'slugify';

interface ProductSize {
  size: 'S' | 'M' | 'L' | 'XL' | 'XXL';
  quantity: number;
  stock: number;
}

@Schema({ timestamps: true })
export class Product extends Document {
  @Prop({ required: true, trim: true })
  product_name: string;

  @Prop({ required: true })
  product_thumb: string;

  @Prop()
  product_description: string;

  @Prop({ required: true })
  product_price: number;

  @Prop({ type: Types.ObjectId, ref: 'Category', required: true })
  category_id: Types.ObjectId;

  @Prop({ default: 4.5, min: 1, max: 5 })
  product_ratingsAverage: number;

  @Prop({
    required: true,
    type: [
      {
        size: {
          type: String,
          enum: ['S', 'M', 'L', 'XL', 'XXL'],
          required: true,
        },
        quantity: { type: Number, required: true },
        stock: { type: Number, require: true, default: 0 },
      },
    ],
  })
  product_size: ProductSize[];

  @Prop({ required: true })
  product_material: string;

  @Prop({ required: true })
  product_brand: string;

  @Prop({ default: true, select: false })
  isDraft: boolean;

  @Prop({ default: false, select: false })
  isPublished: boolean;

  @Prop({ unique: true })
  product_slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

ProductSchema.pre('save', function (next) {
  if (this.isModified('product_name')) {
    this.product_slug = slugify(this.product_name, { lower: true });
  }
  next();
});
