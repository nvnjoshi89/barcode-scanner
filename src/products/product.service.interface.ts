import { InsertProductDto } from './dto/insert-product.dto';
import { ProductResponseDto } from './dto/product.response.dto';
import { UpdateProductDto } from './dto/update-product.dto';

export interface IProductService {
  getAllproducts(): Promise<ProductResponseDto[]>;
  getProductById(id: number): Promise<ProductResponseDto>;
  getProductByBarcode(barcode: string): Promise<ProductResponseDto>;
  insertProductDto(data: InsertProductDto): Promise<ProductResponseDto>;
  updateProduct(
    id: number,
    data: UpdateProductDto,
  ): Promise<ProductResponseDto>;
  deleteProduct(id: number): Promise<void>;
}
