import { CatsService } from './cats.service';
import { HttpExceptionFilter } from './../http-exception.filter';
import {
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  UseFilters,
} from '@nestjs/common';

@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(private readonly CatsService: CatsService) {}

  // cats/
  @Get()
  getAllCats() {
    return 'all cat api';
  }

  // cats/:id
  @Get(':id')
  getOneCat(@Param('id', ParseIntPipe) param: number) {
    console.log(param);
    console.log(typeof param);

    return 'one cat api';
  }

  @Post()
  createCat() {
    return 'create cat api';
  }

  @Put(':id')
  updateCat() {
    return 'update cat api';
  }

  @Patch(':id')
  updateCatPartial() {
    return 'update api';
  }

  @Delete(':id')
  deleteCat() {
    return 'delete service api';
  }
}
