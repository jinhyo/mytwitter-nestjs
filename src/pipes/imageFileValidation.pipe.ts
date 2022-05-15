import {
  PipeTransform,
  Injectable,
  BadRequestException,
  PayloadTooLargeException,
  Logger,
} from '@nestjs/common';
import { FileUpload } from 'graphql-upload';
import {
  INAPPROPRIATE_IMAGE_TYPE_MSG,
  TOO_LARGE_UPLOADED_FILE_MSG,
} from 'src/commonConstants/errorMsgs/etcErrorMsgs';
import { UploadedImgOption } from 'src/commonTypes/uploadedImgOption.interface';

@Injectable()
export class ImageFileValidationPipe implements PipeTransform {
  constructor(private option: UploadedImgOption) {}

  logger = new Logger('ImageFileValidationPipe');

  async transform(file: FileUpload): Promise<FileUpload> {
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.mimetype)) {
      this.logger.error(INAPPROPRIATE_IMAGE_TYPE_MSG);
      throw new BadRequestException(INAPPROPRIATE_IMAGE_TYPE_MSG);
    }

    await this.checkFileSize(file, this.option.fileSize);

    return file;
  }

  /** @desc 정해진 파일 사이즈를 벗어나는지 확인 */
  private async checkFileSize(
    file: FileUpload,
    fileSize: number,
  ): Promise<void | never> {
    const stream = file.createReadStream();

    let fileBytes: number = 0;
    for await (const uploadChunk of stream) {
      fileBytes += (uploadChunk as Buffer).byteLength;
    }

    if (fileBytes > fileSize) {
      this.logger.error(TOO_LARGE_UPLOADED_FILE_MSG);
      throw new PayloadTooLargeException(TOO_LARGE_UPLOADED_FILE_MSG);
    }
  }
}
