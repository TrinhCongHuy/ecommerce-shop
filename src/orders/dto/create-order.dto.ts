import {
  IsArray,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { OrderStatus, PaymentMethod } from '../schemas/order.schema';

export class CreateOrderDto {
  @IsArray()
  @IsNotEmpty()
  products: Array<{
    productId: string;
    quantity: number;
    size: string;
    price: number;
  }>;

  @IsString()
  @IsNotEmpty()
  phone: string;

  @IsString()
  @IsNotEmpty()
  shippingAddress: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsNumber()
  shippedAt?: Date;

  @IsOptional()
  @IsNumber()
  deliveredAt?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number;

  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsNumber()
  shippingCost?: number;
}
