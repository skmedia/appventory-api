import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import slugify from 'slugify';
import { AssetsRepository } from './assets.repository';
import { AwsFileService } from './aws-file.service';

// get from env
const appDir = './uploads/applications';

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

    const applicationAssetsDir = fs.mkdtempSync(
      path.join(os.tmpdir(), applicationId + '-'),
    );

    const fileList = [];
    let i = 0;
    files.forEach(async (f) => {
      const filename = slugify(f.originalname, { lower: true });
      const filePath = applicationAssetsDir + '/' + filename;
      fs.writeFileSync(filePath, f.buffer);
      fileList.push({
        filename,
        path: filePath,
        type: f.mimetype,
        description: fileDescriptions[i] ?? null,
      });
      i++;
    });
    return {
      applicationId,
      fileList,
    };
  }
  removeFile(file: string, applicationId: string) {
    const applicationAssetsDir = appDir + '/' + applicationId;
    fs.rmSync(applicationAssetsDir + '/' + file);
  }

  async removeForApplication(applicationId: string) {
    const files = await this.repo.findByApplicationId(applicationId);
    return this.removeMultiple(files.map((f) => f.id));
  }

  async removeMultiple(fileIds: Array<string>) {
    const files = await this.repo.findManyByFileId(fileIds);

    if (!files.length) {
      return;
    }

    this.deleteFilesInFolder(
      files[0].applicationId,
      files.map((f) => f.filename),
    );
  }

  async deleteFilesInFolder(folder: string, files: Array<string>) {
    files.forEach(async (f) => {
      try {
        const file = appDir + '/' + folder + '/' + f;
        fs.rmSync(file);
      } catch {}
    });

    const dirToDeleteIfEmpty = appDir + '/' + folder;
    try {
      const filesInDir = fs.readdirSync(dirToDeleteIfEmpty);
      if (!filesInDir.length) {
        try {
          fs.rmSync(dirToDeleteIfEmpty, { recursive: true, force: true });
        } catch {}
      }
    } catch {}
  }

  async moveFiles(folder: string, files: Array<string>) {
    files.forEach(async (f) => {
      try {
        const filename = path.basename(f);
        const newFolder = appDir + '/' + folder;
        const newPath = newFolder + '/' + filename;
        try {
          fs.mkdirSync(newFolder, { recursive: true });
        } catch {}
        fs.renameSync(f, newPath);
      } catch (e) {
        Logger.error('could not move files', { folder, files, e });
      }
    });
  }

  async download(id: string) {
    const asset = await this.repo.findOneById(id);
    const file = appDir + '/' + asset.applicationId + '/' + asset.filename;
    return fs.createReadStream(file);
  }
}
