import S3 from 'aws-sdk/clients/s3';
import { Inject, Injectable } from '@nestjs/common';
import { AssetsRepository } from './assets.repository';
import slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AwsFileService {
  constructor(
    @Inject('S3_CLIENT')
    private s3Client: S3,
    private repo: AssetsRepository,
  ) {}

  async upload(
    applicationId: string,
    files: Array<Express.Multer.File>,
    fileDescriptions: Array<any>,
  ) {
    const i = 0;
    const promises = [];

    files.forEach((f) => {
      const filename = slugify(f.originalname, { lower: true });
      const key = uuidv4() + '-' + filename;

      const uploadResult = new Promise((resolve) => {
        this.s3Client
          .upload({
            Bucket: process.env.BUCKETEER_BUCKET_NAME,
            Key: key,
            Body: f.buffer,
          })
          .promise()
          .then((r) => {
            resolve({
              filename,
              key: r.Key,
              location: r.Location,
              type: f.mimetype,
              description: fileDescriptions[i] ?? null,
            });
          });
      });
      promises.push(uploadResult);
    });

    return Promise.all(promises).then((values) => {
      return {
        applicationId,
        fileList: values.map((v) => v),
      };
    });
  }

  async getFileAsStream(key: string) {
    return this.s3Client
      .getObject({
        Bucket: process.env.BUCKETEER_BUCKET_NAME,
        Key: key,
      })
      .createReadStream();
  }

  async deleteKeys(keys: any[]) {
    return this.s3Client.deleteObjects({
      Bucket: process.env.BUCKETEER_BUCKET_NAME,
      Delete: {
        Objects: keys.map((k) => ({ Key: k })),
      },
    });
  }
}
