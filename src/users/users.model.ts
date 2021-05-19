import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { Consultation } from '../salon/consultation/consultation.model';
import { FavoriteNews } from '../news/favoriteNews.model';
import { News } from '../news/news.model';
import { Product } from '../product/product.model';
import { FavoriteProducts } from '../product/favoriteProducts.model';

interface UserCreationAttrs {
  email: string;
  password: string;
}

@Table({ tableName: 'users' })
export class User extends Model<User, UserCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'user@mail.ru', description: 'Почтовый адрес' })
  @Column({ type: DataType.STRING, unique: true, allowNull: false })
  email: string;

  @ApiProperty({ example: 'Антон', description: 'Имя' })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: '+375447689764', description: 'Телефон' })
  @Column({ type: DataType.STRING, allowNull: false })
  phone: string;

  @ApiProperty({ example: '12345678', description: 'Пароль' })
  @Column({ type: DataType.STRING, allowNull: false })
  password: string;

  @BelongsToMany(() => Role, () => UserRoles)
  roles: Role[];

  @BelongsToMany(() => News, () => FavoriteNews)
  favoriteNews: News[];

  @BelongsToMany(() => Product, () => FavoriteProducts)
  favoriteProducts: Product[];

  @HasMany(() => Consultation)
  consultations: Consultation[];
}
