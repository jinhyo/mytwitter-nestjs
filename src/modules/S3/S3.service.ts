import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FILE_UPLOAD_FAILED_MSG } from 'src/commonConstants/errorMsgs/serviceErrorMsgs';
import { S3 } from 'aws-sdk';
import { FileUpload } from 'graphql-upload';
import { ReadStream } from 'fs';
@Injectable()
export class S3Service {
  constructor(private readonly configService: ConfigService) {}

  private logger = new Logger('S3Service');

  /**
   * @desc 아바타 사진 업로드
   * @returns 파일 URL
   */
  async uploadAvatarImg(
    userId: number,
    { createReadStream, filename, mimetype }: FileUpload,
  ): Promise<string> {
    const exeName = filename.split('.').slice(-1).join('');
    const fileFolder = this.configService.get('AWS_BUCKET_AVATAR_IMG_FOLDER');
    const filePath = `${fileFolder}/user-${userId}_avatarImg.${exeName}`;

    return await this.uploadFileToS3(filePath, createReadStream());
  }

  /**
   * @desc S3에 파일 업로드
   * @return 파일 위치 url
   */
  private async uploadFileToS3(
    filePath: string,
    fileStream: ReadStream,
  ): Promise<string> {
    const s3 = new S3();
    const bucketName = this.configService.get('AWS_BUCKET');

    try {
      const uploadResult = await s3
        .upload({
          Bucket: bucketName,
          Body: fileStream,
          Key: filePath,
        })
        .promise();

      return uploadResult.Location;
    } catch (error) {
      console.error(error);
      this.logger.error(
        `uploadFile() in S3Service failed - error detail : ${error.message}`,
      );
      throw new InternalServerErrorException(FILE_UPLOAD_FAILED_MSG);
    }
  }
}
