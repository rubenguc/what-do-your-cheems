import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('ping')
  getVersion(): string {
    return 'pong';
  }
}
