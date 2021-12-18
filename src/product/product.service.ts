import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async allProducts(): Promise<Product[]> {
    return await this.prisma.product.findMany();
  }

  async getProductById(id: string): Promise<Product> {
    return await this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async createProduct(dto: ProductDto): Promise<Product> {
    return await this.prisma.product.create({
      data: dto,
    });
  }

  async updateProduct(id: string, data: any): Promise<Product> {
    return await this.prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteProduct(id: string): Promise<Product> {
    return await this.prisma.product.delete({
      where: { id },
    });
  }
}
