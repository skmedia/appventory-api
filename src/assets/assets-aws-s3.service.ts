/*
import S3 from 'aws-sdk/clients/s3';
import { Injectable } from '@nestjs/common';
const client = new S3({
  region: process.env.BUCKETEER_AWS_REGION,
  credentials: {
    accessKeyId: process.env.BUCKETEER_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.BUCKETEER_AWS_SECRET_ACCESS_KEY,
  },
});

const bucket = process.env.BUCKETEER_AWS_REGION;
client.putObject({
  Bucket: bucket,
  Key: '',
  Body: '',
});

client.deleteObjects({
  Bucket: bucket,
  Delete: {
    Objects: [
      {
        Key: 'OjectKey_1',
      },
    ],
  },
});
client.upload({ Bucket: '', Key: '', Body: '' });
*/

/*
// get from env
const appDir = './uploads/applications';

@Injectable()
export class AssetsService {
  constructor(private repo: AssetsRepository) {}
}
*/
