import { AwsService } from './aws.service';
import {
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// npm i -D @types/multer
// npm i aws-sdk @nestjs/config

@Controller()
export class AppController {
  constructor(private readonly awsService: AwsService) {}

  @Get()
  getHello(): string {
    return 'hello, aws s3';
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMediaFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);

    return await this.awsService.uploadFileToS3('cats', file);
  }

  @Get('cats')
  getImageUrl(@Param('key') key: string) {
    return this.awsService.getAwsS3FileUrl(key);
  }
}
