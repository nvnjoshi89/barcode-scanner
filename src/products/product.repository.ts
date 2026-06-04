import { Injectable } from "@nestjs/common";
import { Product } from "./product.entity";
import {BaseRepositor}

@Injectable()
export class ProductRepository extends BaseRepository<Product>{

}