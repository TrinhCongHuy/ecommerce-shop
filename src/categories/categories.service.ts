import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category } from './schemas/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category>,
  ) {}
  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll(): Promise<Category[]> {
    return await this.categoryModel.find();
  }

  async findOne(id: string): Promise<Category> {
    return await this.categoryModel.findById(id);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return await this.categoryModel.findByIdAndUpdate(id, updateCategoryDto, {
      new: true,
      runValidators: true,
    });
  }

  async remove(id: string): Promise<void> {
    const result = await this.categoryModel.deleteOne({ _id: id }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
