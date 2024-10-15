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
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auths/jwt-auth.guard';
import { Roles } from 'src/auths/decorators/roles.decorator';
import { Role } from 'src/auths/enums/role.enum';
import { RolesGuard } from 'src/auths/guards/roles.guard';
// import { SkipThrottle } from '@nestjs/throttler';
import { Category } from './schemas/category.schema';

@ApiTags('categories')
// @SkipThrottle({ default: false })
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Create new category.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create category successfully.',
    type: Category,
  })
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list categories' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'List categories successfully.',
    type: [Category],
  })
  async listCategory(): Promise<Category[]> {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiOperation({ summary: 'Get category details by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Category details retrieved successfully.',
    type: Category,
  })
  async detailCategory(@Param('id') id: string): Promise<Category> {
    return this.categoriesService.findOne(id);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async removeCategory(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
