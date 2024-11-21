import { Injectable } from '@nestjs/common';
import { NestMinioService } from 'nestjs-minio';

@Injectable()
export class StorageService {
  constructor(private readonly minioClient: NestMinioService) {}

  async uploadImage(bucket, name, buffer) {
    const bucketExist = await this.minioClient.getMinio().bucketExists(bucket);

    if (!bucketExist) {
      await this.minioClient.getMinio().makeBucket(bucket);
    }
    await this.minioClient.getMinio().putObject(bucket, name, buffer);
  }

  public async getImage(bucket, name, res) {
    const data = await this.minioClient.getMinio().getObject(bucket, name);

    return data.pipe(res);
  }
}
