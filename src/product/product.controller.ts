import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Query,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import {
  ApiBody,
  ApiConsumes,
  ApiQuery,
  ApiResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger';
import { Roles } from '../roles/decorators/roles.decorator';
import { Role } from '../roles/enums/role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../roles/guards/roles.guard';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Product } from './product.model';
import { News } from '../news/news.model';
import { CreateNewsDto } from '../news/dto/create-news.dto';

@ApiTags('Продукты')
@ApiSecurity('bearer')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Roles(Role.ADMIN)
  @ApiResponse({ status: 200, type: Product })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add new product',
    type: CreateProductDto,
  })
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@UploadedFile() photo, @Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto, photo);
  }

  @Get()
  @ApiResponse({ status: 200, type: [Product] })
  @ApiQuery({ name: 'limit', type: 'Number', required: false })
  @ApiQuery({ name: 'offset', type: 'Number', required: false })
  findAll(@Query('limit') limit?: number, @Query('offset') offset?: number) {
    return this.productService.findAll(offset, limit);
  }

  @ApiResponse({ status: 200, type: Product })
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @ApiResponse({ status: 200, type: Product })
  @UseInterceptors(FileInterceptor('photo'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'Add new news',
    type: CreateProductDto,
  })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @UploadedFile() photo,
    @Body() createNewsDto: CreateProductDto,
  ) {
    const {
      numberOfAffectedRows,
      updatedProducts,
    } = await this.productService.update(+id, createNewsDto, photo);
    if (numberOfAffectedRows === 0) {
      throw new NotFoundException('Такого продукта не существует');
    }
    return updatedProducts;
  }

  @ApiResponse({ status: 200 })
  @Roles(Role.ADMIN)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const deleted = await this.productService.delete(id);
    if (deleted === 0) {
      throw new NotFoundException('Такого продукта не существует');
    }
    return 'Successfully deleted';
  }
}
