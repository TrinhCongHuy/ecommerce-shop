import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ValidationPipe,
  HttpException,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { CartsService } from './carts.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';
import { Cart } from './schemas/cart.schema';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('cart')
@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCart(
    @Body(new ValidationPipe()) createCartDto: CreateCartDto,
    @Req() req,
  ): Promise<Cart> {
    try {
      const userId = req.user._id;
      return await this.cartsService.create(userId, createCartDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error create cart :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    try {
      return this.cartsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error get list cart :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req) {
    try {
      const userId = req.user._id;
      return this.cartsService.findOne(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error get cart of user :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async updateCart(
    @Param('id') id: string,
    @Body() updateCartDto: UpdateCartDto,
    @Req() req,
  ) {
    try {
      const userId = req.user._id;
      return this.cartsService.update(userId, id, updateCartDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error update cart :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id') id: string, @Req() req) {
    try {
      const userId = req.user._id;
      return this.cartsService.remove(userId, id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error delete cart :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
