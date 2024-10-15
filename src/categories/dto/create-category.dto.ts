import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty({ message: 'Category name must not be empty' })
  @IsString({ message: 'Category name must be a string' })
  category_name: string;

  @IsOptional()
  description?: string;
}
