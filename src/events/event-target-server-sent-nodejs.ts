import EventSource from 'eventsource';

import { MastoConfig } from '../config';
import { Serializer } from '../serializers';
import { BaseEventTarget } from './base-event-target';
import { EventTarget } from './event-target';

export class EventTargetServerSentNodejsImpl
  extends BaseEventTarget
  implements EventTarget
{
  private es?: EventSource;

  constructor(
    protected readonly baseUrl: string,
    protected readonly version: string,
    protected readonly config: MastoConfig,
    protected readonly serializer: Serializer,
  ) {
    super();
    // this.es.addEventListener('message', this.handleMessage);
  }

  connect(path: string, params: Record<string, unknown> = {}) {
    const url =
      this.baseUrl +
      path +
      '?' +
      this.serializer.serialize('application/x-www-form-urlencoded', params);

    const headers: Record<string, unknown> = {};
    if (this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    console.log({ url, headers, params });

    return new Promise<this>((resolve, reject) => {
      this.es = new EventSource(url, { headers });
      // this.es.addEventListener('message', (d) => console.log(d));
      this.es.onmessage = (e) => console.log(e);
      this.es.addEventListener('error', reject);
      // this.es.addEventListener('message', this.handleMessage);
      this.es.addEventListener('open', () => resolve(this));
    });
  }

  disconnect() {
    if (!this.es) return;
    this.es.close();
  }

  // private handleMessage = (e: MessageEvent) => {
  //   // https://docs.joinmastodon.org/methods/timelines/streaming/#server-sent-events-http:~:text=all%20direct%20messages-,Stream%20contents,-The%20stream%20will
  //   console.log(e.data);
  // };
}
