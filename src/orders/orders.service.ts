import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { Product } from '../products/schemas/product.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private readonly orderModel: Model<Order>,
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(
    userId: Types.ObjectId,
    createOrderDto: CreateOrderDto,
  ): Promise<Order> {
    const newOrder = {
      userId,
      ...createOrderDto,
    };
    const result = await this.orderModel.create(newOrder);
    if (result) {
      for (const product of result.products) {
        console.log('product', product.productId);
        const productInDb = await this.productModel.findById(product.productId);
        if (productInDb) {
          console.log('productInDb', productInDb);
          // for (const size of productInDb.product_size) {}
        }
      }
    }

    return result;
  }

  async findAll(): Promise<Order[]> {
    return await this.orderModel.find();
  }

  async findMany(userId: Types.ObjectId): Promise<Order[]> {
    return await this.orderModel.findOne({ userId });
  }

  async findById(id: string): Promise<Order> {
    return await this.orderModel.findById(id);
  }

  async update(id: string, updateOrderDto: UpdateOrderDto): Promise<Order> {
    const existingOrder = await this.orderModel.findById(id);

    if (!existingOrder) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Order not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // Kiểm tra trạng thái hiện tại của đơn hàng
    if (updateOrderDto.status) {
      if (updateOrderDto.status === OrderStatus.CANCELED) {
        // Chỉ cho phép hủy đơn hàng nếu trạng thái hiện tại là PENDING
        if (existingOrder.status !== OrderStatus.PENDING) {
          throw new HttpException(
            {
              status: HttpStatus.BAD_REQUEST,
              message: 'Cannot cancel an order that is not pending.',
            },
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      existingOrder.status = updateOrderDto.status;
    }

    // Cập nhật thời gian giao hàng nếu có
    if (updateOrderDto.shippedAt) {
      existingOrder.shippedAt = updateOrderDto.shippedAt;
    }

    if (updateOrderDto.deliveredAt) {
      existingOrder.deliveredAt = updateOrderDto.deliveredAt;
    }

    return await existingOrder.save();
  }

  async remove(id: string) {
    const deleteOrder = await this.orderModel.findByIdAndDelete(id);
    if (!deleteOrder) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: `Order with ID "${id}" not found`,
        },
        HttpStatus.NOT_FOUND,
      );
    }

    return {
      message: `Order with ID "${id}" has been successfully deleted`,
    };
  }
}
