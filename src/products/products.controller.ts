import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  UploadedFile,
  UseInterceptors,
  HttpException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auths/decorators/roles.decorator';
import { Role } from 'src/auths/enums/role.enum';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';
import { RolesGuard } from 'src/auths/guards/roles.guard';
import { Product } from './schemas/product.schema';
import { UploadService } from 'src/upload/upload.service';
import { multerConfig } from 'src/upload/multer-config';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(
    private productsService: ProductsService,
    private uploadService: UploadService,
  ) {}

  @Post()
  @Roles(Role.User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Product has been created successfully.',
    type: Product,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        const result = await this.uploadService.uploadImage(file);
        if (result && result.url) {
          createProductDto.product_thumb = result.url;
        }
      }
      return await this.productsService.create(createProductDto);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to create product. ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all products' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List of products retrieved successfully.',
    type: [Product],
  })
  async listProduct() {
    try {
      return await this.productsService.findAll();
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve products. ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get details of a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product details retrieved successfully.',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  async detailProduct(@Param('id') id: string) {
    try {
      const product = await this.productsService.findOne(id);
      if (!product) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Product not found.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return product;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve product. ' + error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @UseInterceptors(FileInterceptor('file', multerConfig))
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product updated successfully.',
    type: Product,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  async updateProduct(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      if (file) {
        const result = await this.uploadService.uploadImage(file);
        if (result && result.url) {
          updateProductDto.product_thumb = result.url;
        }
      }
      const updatedProduct = await this.productsService.update(
        id,
        updateProductDto,
      );
      if (!updatedProduct) {
        throw new HttpException(
          {
            status: HttpStatus.NOT_FOUND,
            error: 'Product not found.',
          },
          HttpStatus.NOT_FOUND,
        );
      }
      return updatedProduct;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to update product. ' + error.message,
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Product deleted successfully.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Product not found.',
  })
  async removeProduct(@Param('id') id: string) {
    try {
      const deletedProduct = await this.productsService.remove(id);
      return deletedProduct;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error: 'Failed to delete product. ' + error.message,
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
