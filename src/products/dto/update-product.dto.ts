import { PartialType } from '@nestjs/mapped-types';
import { InsertProductDto } from './insert-product.dto';

export class UpdateProductDto extends PartialType(InsertProductDto) {}
