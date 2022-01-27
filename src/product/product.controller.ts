import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Product } from '@prisma/client';
import { ProductDto } from './dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(
    private productService: ProductService,
    @Inject('PRODUCT_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post()
  async createProduct(@Body() dto: ProductDto): Promise<Product> {
    const product = await this.productService.createProduct(dto);

    this.client.emit('product_created', product);
    return product;
  }

  @Get()
  async all(): Promise<Product[]> {
    this.client.emit('hello', { message: 'Hello from RabbitMQ!' });
    return this.productService.allProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() data: any,
  ): Promise<Product> {
    const updatedProduct = await this.productService.updateProduct(id, data);

    this.client.emit('product_updated', updatedProduct);

    return updatedProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProduct(id);

    this.client.emit('product_deleted', id);
  }
}
