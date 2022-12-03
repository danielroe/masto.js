import type { MastoConfig } from '../../../config';
import { version } from '../../../decorators';
import type { Http } from '../../../http';
import { delay, timeout } from '../../../utils';
import type { MediaAttachment } from '../../v1';
import { MediaAttachmentRepository as MediaAttachmentRepositoryV1 } from '../../v1';

export interface CreateMediaAttachmentParams {
  /** The file to be attached, using multipart form data. */
  readonly file: unknown;
  /** A plain-text description of the media, for accessibility purposes. */
  readonly description?: string | null;
  /** Two floating points (x,y), comma-delimited, ranging from -1.0 to 1.0 */
  readonly focus?: string | null;
  /** Custom thumbnail */
  readonly thumbnail?: unknown | null;
}

export interface CreateMediaAttachmentExtraParams {
  /** Wait resolving promise for the media to be uploaded. Defaults to `false` */
  readonly skipPolling?: boolean;
}

// Repository<V1.MediaAttachment, CreateMediaAttachmentParams>;

export class MediaAttachmentRepository {
  private readonly v1: MediaAttachmentRepositoryV1;

  constructor(private readonly http: Http, readonly config: MastoConfig) {
    this.v1 = new MediaAttachmentRepositoryV1(http, config);
  }

  /**
   * @experimental
   * @param id ID of the media
   * @param interval interval of polling
   * @returns Media attachment that has done processing
   */
  waitFor(id: string, interval = 1000): Promise<MediaAttachment> {
    return timeout(
      (async () => {
        let media: MediaAttachment | undefined;

        while (media == undefined) {
          await delay(interval);
          const processing = await this.v1.fetch(id);

          if (processing.url != undefined) {
            media = processing;
          }
        }

        return media;
      })(),
      this.config.timeout,
    );
  }

  /**
   * Creates an attachment to be used with a new status.
   * @param params Parameters
   * @return Attachment
   * @see https://docs.joinmastodon.org/methods/statuses/media/
   */
  @version({ since: '3.1.3' })
  async create(
    params: CreateMediaAttachmentParams,
    extra: CreateMediaAttachmentExtraParams = {},
  ): Promise<MediaAttachment> {
    const media = await this.http.post<MediaAttachment>(
      `/api/v2/media`,
      params,
      { headers: { 'Content-Type': 'multipart/form-data' } },
    );

    if (extra.skipPolling) {
      return media;
    }

    return this.waitFor(media.id);
  }
}
