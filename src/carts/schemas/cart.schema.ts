import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Cart extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop([
    {
      productId: { type: Types.ObjectId, ref: 'Product', required: true },
      quantity: { type: Number, required: true, default: 1 },
      size: { type: String, required: true },
      _id: { type: Types.ObjectId, auto: true },
    },
  ])
  products: Array<{
    _id: Types.ObjectId;
    productId: Types.ObjectId;
    quantity: number;
    size: string;
  }>;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
