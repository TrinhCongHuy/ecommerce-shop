import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Product name is required' })
  @IsString({ message: 'Product name must be a string' })
  product_name: string;

  @IsOptional()
  @IsString({ message: 'Product thumbnail must be a string' })
  product_thumb: string;

  @IsOptional()
  @IsString({ message: 'Product description must be a string' })
  product_description?: string;

  @IsNotEmpty({ message: 'Product price is required' })
  @IsNumber({}, { message: 'Product price must be a number' })
  product_price: number;

  @IsNotEmpty({ message: 'Product category is required' })
  @IsString({ message: 'Product category must be a string' })
  category_id: string;

  @IsOptional()
  @IsArray()
  @IsString({
    each: true,
    message: 'Product size must be an array of strings',
  })
  product_size?: string[];

  @IsNotEmpty({ message: 'Product material is required' })
  @IsString({ message: 'Product material must be a string' })
  product_material: string;

  @IsNotEmpty({ message: 'Product brand is required' })
  @IsString({ message: 'Product brand must be a string' })
  product_brand: string;

  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;

  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
