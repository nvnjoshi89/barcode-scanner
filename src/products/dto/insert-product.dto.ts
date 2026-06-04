import {
  IsNotEmpty,
  IsOptional,
  IsPositive,
  Min,
  IsNumber,
} from 'class-validator';

export class InsertProductDto {
  @IsNotEmpty()
  barcode: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsPositive()
  price: number;

  @IsNotEmpty()
  @Min(0)
  stock: number;

  @IsOptional()
  image?: string;

  @IsNotEmpty()
  @IsNumber()
  categoryId: number;
}
