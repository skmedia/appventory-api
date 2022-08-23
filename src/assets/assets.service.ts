import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApplicationAsset } from '@prisma/client';
import { AssetsRepository } from './assets.repository';
import { AwsFileService } from './aws-file.service';

@Injectable()
export class AssetsService {
  constructor(
    private repo: AssetsRepository,
    private awsFileService: AwsFileService,
  ) {}

  async upload(
    applicationId: string,
    files: Array<Express.Multer.File>,
    fileDescriptions: Array<any>,
  ) {
    return await this.awsFileService.upload(
      applicationId,
      files,
      fileDescriptions,
    );
  }

  async deleteFiles(files: { key: string }[]) {
    this.awsFileService.deleteKeys(files.map((f) => f.key));
  }

  async getFileAsStream(id: string, accountId: string) {
    const asset = await this.repo.findOneById(id);
    if (asset.application.accountId !== accountId) {
      throw new UnauthorizedException('invalid account');
    }
    const file = await this.awsFileService.getFileAsStream(asset.key);
    return file;
  }
}
