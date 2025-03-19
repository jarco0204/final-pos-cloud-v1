import { IsNotEmpty, IsMongoId, IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CartItemDto {
  @ApiProperty({ description: 'Product ID to add/update', type: String })
  @IsNotEmpty()
  @IsMongoId()
  product: string;

  @ApiProperty({ description: 'Quantity of the product', example: 1 })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
