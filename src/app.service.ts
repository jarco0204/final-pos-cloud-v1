import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // Default Method to return a string
  getHello(): string {
    return 'Hello Final POS Code Reviewer! Please navigate to /index to interact with e-commerce store.';
  }
}
