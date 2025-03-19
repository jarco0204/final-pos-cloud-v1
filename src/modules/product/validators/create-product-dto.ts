import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsNumber,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ description: 'Name of the product', maxLength: 64 })
  @IsNotEmpty()
  @IsString()
  @MaxLength(64)
  name: string;

  @ApiProperty({
    description: 'Product description',
    maxLength: 2048,
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  description?: string;

  @ApiProperty({ description: 'Price of the product' })
  @IsNotEmpty()
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Stock count, cannot be negative' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  stock: number;

  @ApiProperty({
    description: 'Product Picture, Base64 Data, Less than 1MB',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(1048576) // 1MB in bytes
  image: string;
}
