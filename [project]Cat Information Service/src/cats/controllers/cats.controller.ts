import { LoginRequestDto } from './../../auth/dto/login.request.dto';
import { CatRequestDto } from './../dto/cats.request.dto';
import { ReadOnlyCatDto } from './../dto/cats.dto';
import { Cat } from './../cats.schema';
import { CurrentUser } from './../../common/decorators/user.decorator';
import { JwtAuthGuard } from './../../auth/jwt/jwt.guard';
import { AuthService } from './../../auth/auth.service';
import { CatsService } from './../services/cats.service';
import { HttpExceptionFilter } from './../../common/exceptions/http-exception.filter';
import { SuccessInterceptor } from './../../common/interceptors/success.interceptor';

import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFile,
  UseFilters,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { AwsService } from '../services/aws.service';

@Controller('cats')
@UseInterceptors(SuccessInterceptor)
@UseFilters(HttpExceptionFilter)
export class CatsController {
  constructor(
    private readonly catsService: CatsService,
    private readonly authService: AuthService,
    private readonly awsService: AwsService,
  ) {}

  @ApiOperation({ summary: '현재 고양이 가져오기' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getCurrentCat(@CurrentUser() cat: Cat) {
    return cat.readOnlyData;
  }

  @ApiResponse({
    status: 500,
    description: 'Server error...',
  })
  @ApiResponse({
    status: 200,
    description: '성공!',
    type: ReadOnlyCatDto,
  })
  @ApiOperation({ summary: '회원가입' })
  @Post()
  async signUp(@Body() body: CatRequestDto) {
    return await this.catsService.signUp(body);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@Body() data: LoginRequestDto) {
    return this.authService.jwtLogIn(data);
  }

  // @ApiOperation({ summary: '로그아웃' })
  // @Post('logout')
  // logOut() {
  //   return 'logout';
  // }

  // /* 로컬 업로드 */
  // @ApiOperation({ summary: '고양이 이미지 업로드' })
  // @UseInterceptors(FilesInterceptor('image', 10, multerOptions('cats')))
  // @UseGuards(JwtAuthGuard)
  // @Post('upload')
  // uploadCatImg(
  //   @UploadedFiles() files: Array<Express.Multer.File>,
  //   @CurrentUser() cat: Cat,
  // ) {
  //   console.log(files);

  //   // return { image: `http://localhost:8000/media/cats/${files[0].filename}` };
  //   return this.catsService.uploadImg(cat, files);
  // }

  /* AWS 업로드 */
  @ApiOperation({ summary: '고양이 이미지 업로드' })
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
  @Post('upload')
  async uploadCatImg(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() cat: Cat,
  ) {
    console.log(file);

    const result = await this.awsService.uploadFileToS3('cats', file);

    return this.catsService.uploadImg(cat, result.key);
  }

  @ApiOperation({ summary: '모든 고양이 가져오기' })
  @Get('all')
  getAllCat() {
    return this.catsService.getAllCat();
  }
}
