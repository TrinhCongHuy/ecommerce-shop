import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum OrderStatus {
  PENDING = 'pending', // Đơn hàng đang chờ xử lý
  SHIPPED = 'shipped', // Đơn hàng đã được giao từ kho
  DELIVERED = 'delivered', // Đơn hàng đã được giao thành công
  CANCELED = 'canceled', // Đơn hàng đã bị hủy
}

export enum PaymentMethod {
  CREDIT_CARD = 'credit card', // Thanh toán bằng thẻ tín dụng
  PAYPAL = 'paypal', // Thanh toán qua Paypal
  CASH_ON_DELIVERY = 'cash on delivery', // Thanh toán khi nhận hàng
}

@Schema({ timestamps: true })
export class Order extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({
    type: [
      {
        productId: { type: Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, default: 1 },
        size: { type: String, required: true },
        price: { type: Number, required: true },
      },
    ],
    required: true,
  })
  products: Array<{
    productId: Types.ObjectId;
    quantity: number;
    size: string;
    price: number;
  }>;

  @Prop({
    type: String,
    enum: OrderStatus,
    required: true,
    default: OrderStatus.PENDING,
  })
  status: OrderStatus;

  @Prop({ type: String, required: true })
  phone: string;

  @Prop({ type: String, required: true })
  shippingAddress: string;

  @Prop({ type: Date, default: null })
  shippedAt: Date;

  @Prop({ type: Date, default: null })
  deliveredAt: Date;

  @Prop({ type: String })
  notes: string;

  @Prop({ type: Number, required: true })
  totalAmount: number;

  @Prop({ type: String, enum: PaymentMethod })
  paymentMethod: PaymentMethod;

  @Prop({ type: Number })
  shippingCost: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
