import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CartsService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<Cart | null>,
  ) {}

  async create(
    userId: Types.ObjectId,
    createCartDto: CreateCartDto,
  ): Promise<Cart> {
    let cart = await this.findOne(userId);

    if (!cart) {
      cart = new this.cartModel({ userId, products: [] });
    }

    const productId = new Types.ObjectId(createCartDto.productId);

    const existingItemIndex = cart.products.findIndex(
      (item) =>
        item.productId.toString() === createCartDto.productId.toString() &&
        item.size === createCartDto.size,
    );

    if (existingItemIndex > -1) {
      cart.products[existingItemIndex].quantity += createCartDto.quantity;
    } else {
      cart.products.push({
        _id: new Types.ObjectId(),
        productId,
        quantity: createCartDto.quantity,
        size: createCartDto.size,
      });
    }

    return cart.save();
  }

  async findAll() {
    return await this.cartModel.find();
  }

  async findOne(userId: Types.ObjectId) {
    return await this.cartModel.findOne({ userId });
  }

  async update(
    userId: Types.ObjectId,
    id: string,
    updateCartDto: UpdateCartDto,
  ) {
    const cart = await this.findOne(userId);
    if (!cart) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Cart not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item._id.toString() === id,
    );

    if (existingProductIndex > -1) {
      if (updateCartDto.quantity) {
        const newQuantity = updateCartDto.quantity;
        // Nếu số lượng mới lớn hơn 0, cập nhật số lượng
        if (newQuantity > 0) {
          cart.products[existingProductIndex].quantity = newQuantity;
        } else {
          // Nếu số lượng mới bằng hoặc nhỏ hơn 0, xóa sản phẩm khỏi giỏ hàng
          cart.products.splice(existingProductIndex, 1);
        }
      } else if (updateCartDto.size) {
        cart.products[existingProductIndex].size = updateCartDto.size;
      }
    }
    await cart.save();
    return {
      status: HttpStatus.OK,
      message: 'Cart updated successfully.',
      cart,
    };
  }

  async remove(userId: Types.ObjectId, id: string) {
    const cart = await this.findOne(userId);
    if (!cart) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Cart not found.',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const existingProductIndex = cart.products.findIndex(
      (item) => item._id.toString() === id,
    );

    if (existingProductIndex > -1) {
      cart.products.splice(existingProductIndex, 1);
      await cart.save();
      return {
        status: HttpStatus.OK,
        message: 'Product removed from cart successfully.',
        cart,
      };
    } else {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          message: 'Product not found in cart.',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
