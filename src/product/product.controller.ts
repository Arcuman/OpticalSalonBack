import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFile,
  Query,
  Put,
  NotFoundException,
  Req,
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
import { Request } from 'express';
import { UsersService } from '../users/users.service';

@ApiTags('Продукты')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly usersService: UsersService,
  ) {}

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
  @ApiQuery({ name: 'name', type: 'String', required: false })
  @ApiQuery({ name: 'price', type: 'Number', required: false })
  @ApiQuery({ name: 'limit', type: 'Number', required: false })
  @ApiQuery({ name: 'offset', type: 'Number', required: false })
  async findAll(
    @Req() req: Request,
    @Query('name') name?: string,
    @Query('price') price?: number,
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    const user = req.user as { userId: number };
    const news = await this.productService.findAll(name, offset, limit, price);
    const favorite = await this.usersService.getFavoriteProduct(user.userId);
    return news
      .map((oneNews) => {
        let isFavorite = false;
        if (favorite.some((favorite) => favorite.id === oneNews.id)) {
          isFavorite = true;
        }
        return { ...oneNews.toJSON(), isFavorite };
      })
      .sort((a: any, b: any) => b.id - a.id);
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
