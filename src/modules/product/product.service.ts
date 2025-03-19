import { Injectable } from '@nestjs/common';
import { Product } from 'src/schemas/Product';

@Injectable()
export class ProductService {
  // Class property to store products
  private products = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description of product 1',
      price: 100,
      stock: 10,
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description of product 2',
      price: 200,
      stock: 20,
    },
  ];

  // Getter for products
  getProducts() {
    return this.products;
  }

  // Overloaded getter for products using id
  getProduct(id: string) {
    return this.products.find((product) => product.id === id);
  }

  // TODO: Implement Create Product
  createProduct() {}

  // Method to replace product object in array
  updateProduct(id: string, product: Product) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products[index] = product;
    return product;
  }

  // Method to delete product object from array
  deleteProduct(id: string) {
    const index = this.products.findIndex((product) => product.id === id);
    this.products.splice(index, 1);
    return id;
  }
}
