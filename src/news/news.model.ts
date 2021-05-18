import {
  BelongsToMany,
  Column,
  DataType,
  Model,
  Table,
} from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';
import { Role } from '../roles/roles.model';
import { UserRoles } from '../roles/user-roles.model';
import { User } from '../users/users.model';
import { FavoriteNews } from './favoriteNews.model';

interface NewsCreationAttrs {
  title: string;
  description: string;
  image: string;
  date: Date;
}

@Table({ tableName: 'news' })
export class News extends Model<News, NewsCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Открытие магазина', description: 'Заголовок' })
  @Column({ type: DataType.STRING, allowNull: false })
  title: string;

  @ApiProperty({
    example: 'Описание открытия нового магазина',
    description: 'Описание',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ApiProperty({
    example: ['d:/image/sdsd', 'http://sds.com/sd'],
    description: 'Путь к картинке',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  image: string;

  @ApiProperty({
    example: '20.20.2012',
    description: 'Дата публикации новости',
  })
  @Column({ type: DataType.DATE, allowNull: false })
  date: Date;

  @BelongsToMany(() => User, () => FavoriteNews)
  users: User[];
}
