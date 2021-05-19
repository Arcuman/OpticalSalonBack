import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { User } from './users.model';
import { InjectModel } from '@nestjs/sequelize';
import { CreateUserDto } from './dto/create-user.dto';
import { RolesService } from '../roles/roles.service';
import { AddRoleDto } from './dto/add-role.dto';
import { Sequelize } from 'sequelize-typescript';
import { Role as RoleModel } from '../roles/roles.model';
import { Role } from '../roles/enums/role.enum';
import { AddFavoriteNewsDto } from './dto/add-favorite-news-dto';
import { NewsService } from '../news/news.service';
import { News } from '../news/news.model';
import { AddFavoriteProductsDto } from './dto/add-favorite-products-dto';
import { ProductService } from '../product/product.service';
import { Product } from '../product/product.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User) private userRepository: typeof User,
    private roleService: RolesService,
    private newsService: NewsService,
    private productsService: ProductService,
    private sequelize: Sequelize,
  ) {}

  async createUser(dto: CreateUserDto) {
    try {
      return await this.sequelize.transaction(async (t) => {
        const user = await this.userRepository.create(dto, { transaction: t });
        const role = await this.roleService.getRoleByValue(Role.USER, t);
        await user.$set('roles', [role.id], { transaction: t });
        user.roles = [role];
        return user;
      });
    } catch (err) {
      console.log(err);
      throw new InternalServerErrorException();
    }
  }

  async getAllUsers() {
    return await this.userRepository.findAll({
      include: { all: true },
      attributes: { exclude: ['password'] },
    });
  }

  async getUserById(id: number) {
    return await this.userRepository.findByPk(id, {
      attributes: ['id', 'email', 'phone', 'name'],
    });
  }

  async getUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: { email },
      include: [
        {
          model: RoleModel,
        },
      ],
    });
  }

  async addRole(dto: AddRoleDto) {
    const user = await this.userRepository.findByPk(dto.userId);
    const role = await this.roleService.getRoleByValue(dto.value);
    if (role && user) {
      await user.$add('role', role.id);
      return dto;
    }
    throw new HttpException(
      'Пользователь или роль не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async addFavoriteNews(dto: AddFavoriteNewsDto, userId: number) {
    const user = await this.userRepository.findByPk(userId);
    const news = await this.newsService.findOne(dto.newsId);
    if (news && user) {
      const res = await user.$add('favoriteNew', news.id);
      if (!res) {
        return 'Already added';
      }
      return res;
    }
    throw new HttpException(
      'Пользователь или новость не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteFavoriteNews(dto: AddFavoriteNewsDto, userId: number) {
    const user = await this.userRepository.findByPk(userId);
    const news = await this.newsService.findOne(dto.newsId);
    if (news && user) {
      const res = await user.$remove('favoriteNew', news.id);
      console.log(res);
      if (res) {
        return 'Success delete';
      }
      return 'Nothing delete';
    }
    throw new HttpException(
      'Пользователь или новость не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async getFavoriteNews(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      include: [
        {
          model: News,
          as: 'favoriteNews',
        },
      ],
    });
    if (user) {
      return user.favoriteNews;
    }
    throw new HttpException(
      'Пользователь или новость не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async addFavoriteProduct(dto: AddFavoriteProductsDto, userId: number) {
    const user = await this.userRepository.findByPk(userId);
    const products = await this.productsService.findOne(dto.productId);
    if (products && user) {
      const res = await user.$add('favoriteProducts', products.id);
      if (!res) {
        return 'Уже в избранном';
      }
      return res;
    }
    throw new HttpException(
      'Пользователь или продукт не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async deleteFavoriteProduct(dto: AddFavoriteProductsDto, userId: number) {
    const user = await this.userRepository.findByPk(userId);
    const product = await this.productsService.findOne(dto.productId);
    if (product && user) {
      const res = await user.$remove('favoriteProducts', product.id);
      console.log(res);
      if (res) {
        return 'Успешно удалено';
      }
      return 'Нечего удалять';
    }
    throw new HttpException(
      'Пользователь или новость не найдены',
      HttpStatus.NOT_FOUND,
    );
  }

  async getFavoriteProduct(userId: number) {
    const user = await this.userRepository.findByPk(userId, {
      include: [
        {
          model: Product,
          as: 'favoriteProducts',
        },
      ],
    });
    if (user) {
      return user.favoriteProducts;
    }
    throw new HttpException(
      'Пользователь или продукт не найдены',
      HttpStatus.NOT_FOUND,
    );
  }
}
