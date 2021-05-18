import { Column, DataType, Length, Model, Table } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

interface ProductCreationAttrs {
  brand: string;
  model: string;
  description: string;
  cost: number;
  country: string;
  photo: any;
}

@Table({ tableName: 'products' })
export class Product extends Model<Product, ProductCreationAttrs> {
  @ApiProperty({ example: '1', description: 'Уникальный идентификатор' })
  @Column({
    type: DataType.INTEGER,
    unique: true,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @ApiProperty({ example: 'Очки', description: 'Название' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  name: string;

  @ApiProperty({ example: 'обычные', description: 'Брэнд' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  brand: string;

  @ApiProperty({ example: 'БАВ2345', description: 'Модель' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  model: string;

  @ApiProperty({ example: 'Lorem daasdas', description: 'Описание' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  description: string;

  @ApiProperty({ example: 'железо', description: 'Материал' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  material: string;

  @ApiProperty({ example: '200', description: 'Цена' })
  @Column({ type: DataType.DECIMAL, allowNull: false })
  cost: number;

  @ApiProperty({ example: 'Беларусь', description: 'Страна' })
  @Length({ min: 0, max: 40 })
  @Column({ type: DataType.STRING, allowNull: false })
  country: string;

  @ApiProperty({
    example: 'images/sdsda.jpg',
    description: 'Путь к картинке',
  })
  @Column({ type: DataType.STRING, allowNull: false })
  photo: string;
}
