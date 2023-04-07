import { Controller, Get } from '@nestjs/common';
import pkg from '../../../package.json';

@Controller()
export class AppController {
  @Get('version')
  version(): string {
    return pkg.version;
  }
}
