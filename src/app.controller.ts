import { AppService } from './app.service';
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('helloFinalPOS')
  getHello(): string {
    return this.appService.getHello();
  }
}
