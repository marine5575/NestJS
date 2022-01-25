import { Request } from 'express';
import { Body, Controller, Get, Param, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('cats')
export class AppController {
  constructor(private readonly appService: AppService) {}

  // * localhost:8000/cats/hello
  @Get('hello/:id/:name')
  getHello(
    @Req() req: Request,
    @Body() Body,
    @Param() params: { id: string; name: string },
  ): string {
    // console.log(req);
    console.log(params);
    // return 'hello world?';
    return this.appService.getHello();
  }
}
