import { PartialType } from '@nestjs/swagger';
import { CreateCategoryDto } from './create-category.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @IsString({ message: 'Category name must be a string' })
  @IsOptional()
  category_name?: string;

  @IsOptional()
  description?: string;
}
