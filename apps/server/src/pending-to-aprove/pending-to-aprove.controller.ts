import { Body, Controller, Delete, Get, Post } from '@nestjs/common';
import { PendingToAproveService } from './pending-to-aprove.service';
import { CreatePendingToAproveDTO } from './dto/createPendingToAproveDto';
import { ApproveDTO } from './dto/approveDto';
import { EnvService } from '../env/env.service';

@Controller('pending-to-aprove')
export class PendingToAproveController {
  constructor(
    private readonly pendingToAproveService: PendingToAproveService,
    private readonly envService: EnvService,
  ) {}

  @Post('/upload')
  public async create(@Body() body: CreatePendingToAproveDTO) {
    return this.pendingToAproveService.create(body);
  }

  @Post('/approve')
  public async approve(@Body() body: ApproveDTO) {
    if (this.envService.NODE_ENV === 'development') {
      return this.pendingToAproveService.approveById(body);
    }
    return {
      msg: 'Anda paya bobo',
    };
  }

  @Get('/')
  public async getAll() {
    if (this.envService.NODE_ENV === 'development') {
      return this.pendingToAproveService.get();
    }
    return {
      msg: 'Anda paya bobo',
    };
  }

  @Get('/approve-all')
  public async approveAll() {
    if (this.envService.NODE_ENV === 'development') {
      return this.pendingToAproveService.approveAll();
    }
    return {
      msg: 'Anda paya bobo',
    };
  }

  @Delete('/')
  public async delete(@Body() body: ApproveDTO) {
    if (this.envService.NODE_ENV === 'development') {
      return this.pendingToAproveService.delete(body);
    }
    return {
      msg: 'Anda paya bobo',
    };
  }
}
