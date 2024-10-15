import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';
import { Order } from './schemas/order.schema';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @Req() req,
  ): Promise<Order> {
    try {
      const userId = req.user._id;
      return await this.ordersService.create(userId, createOrderDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error create order :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('all')
  @UseGuards(JwtAuthGuard)
  async findAll(): Promise<Order[]> {
    try {
      return this.ordersService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error get list order :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string): Promise<Order> {
    try {
      return this.ordersService.findById(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error get list order :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findManyOfUser(@Req() req): Promise<Order[]> {
    try {
      const userId = req.user._id;
      return this.ordersService.findMany(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error get list order :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ): Promise<Order> {
    try {
      return await this.ordersService.update(id, updateOrderDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error update order :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async removeOrder(@Param('id') id: string) {
    try {
      return await this.ordersService.remove(id);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          message: `Fails error delete order :: ${error.message}`,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
