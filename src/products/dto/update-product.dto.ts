import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import { IsArray, IsObject, IsOptional } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  product_name?: string;

  @IsOptional()
  product_thumb?: string;

  @IsOptional()
  product_description?: string;

  @IsOptional()
  product_price?: number;

  @IsOptional()
  category_id?: string;

  @IsOptional()
  @IsArray()
  @IsObject({ each: true })
  product_size?: string[];

  @IsOptional()
  product_material?: string;

  @IsOptional()
  product_brand?: string;

  @IsOptional()
  isDraft?: boolean;

  @IsOptional()
  isPublished?: boolean;
}
