import { S3 } from 'aws-sdk';
import { getConfig } from '../config-helper';
import Model from './model';
import { ServerError } from './utility';

/**
 * Bucket
 *   The bucket class is responsible for loading clip
 *   metadata into the Model from s3.
 */
export default class Bucket {
  private model: Model;
  private s3: S3;

  constructor(model: Model, s3: S3) {
    this.model = model;
    this.s3 = s3;
  }

  /**
   * Fetch a public url for the resource.
   */
  private getPublicUrl(key: string) {
    return this.s3.getSignedUrl('getObject', {
      Bucket: getConfig().BUCKET_NAME,
      Key: key,
      Expires: 24 * 60 * 30,
    });
  }

  /**
   * Grab metadata to play clip on the front end.
   */
  async getRandomClips(
    client_id: string,
    locale: string,
    count: number
  ): Promise<{ id: number; glob: string; text: string; sound: string }[]> {
    const clips = await this.model.findEligibleClips(client_id, locale, count);
    try {
      return await Promise.all(
        clips.map(async ({ id, path, sentence }) => {
          // We get a 400 from the signed URL without this request
          await this.s3
            .headObject({
              Bucket: getConfig().BUCKET_NAME,
              Key: path,
            })
            .promise();

          return {
            id,
            glob: path.replace('.mp3', ''),
            text: sentence,
            sound: this.getPublicUrl(path),
          };
        })
      );
    } catch (e) {
      console.log('aws error', e, e.stack);
      return [];
    }
  }

  getAvatarClipsUrl(path: string) {
    return this.getPublicUrl(path);
  }

  async getClipUrl(id: string): Promise<string> {
    const clip = await this.model.db.findClip(id);
    return this.getPublicUrl(clip.path);
  }

  async listClips(path: string): Promise<Array<S3.Object>> {
    const bucket = getConfig().BUCKET_NAME;
    const params = {
      Bucket: bucket,
      Delimiter: '/',
      Prefix: path
    };

    const clips: S3.Object[] = [];
    let response = await this.s3.listObjectsV2(params).promise();

    clips.push(...response.Contents);

    while (response.IsTruncated) {
      response = await this.s3.listObjectsV2({ Bucket: bucket, ContinuationToken: response.NextContinuationToken }).promise();

      clips.push(...response.Contents);
    }

    return clips;
  }
}
