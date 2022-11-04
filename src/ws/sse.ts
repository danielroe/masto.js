import { EventEmitter } from 'eventemitter3';
import EventSource from 'eventsource';

import { MastoConfig } from '../config';
import { Serializer } from '../serializers';
import { BaseWs } from './base-ws';
import { EventType, EventTypeMap, Ws, WsEvents } from './ws';

export class ServerSentEventsEvents
  extends EventEmitter<EventTypeMap>
  implements WsEvents
{
  constructor(private readonly es: EventSource) {
    super();
    this.es.addEventListener('message', this.handleMessage);
  }

  disconnect() {
    this.es.close();
  }

  private handleMessage = (e: MessageEvent) => {
    // https://docs.joinmastodon.org/methods/timelines/streaming/#server-sent-events-http:~:text=all%20direct%20messages-,Stream%20contents,-The%20stream%20will
    e.data;
  };
}

export class ServerSentEvents extends BaseWs implements Ws {
  constructor(
    protected readonly baseUrl: string,
    protected readonly version: string,
    protected readonly config: MastoConfig,
    protected readonly serializer: Serializer,
  ) {
    super();
  }

  stream(
    path: string,
    params: Record<string, unknown> = {},
  ): Promise<WsEvents> {
    return new Promise((resolve, reject) => {
      const url = this.baseUrl + path;

      const headers: Record<string, unknown> = { ...(params.headers ?? {}) };
      if (params.accessToken) {
        headers['Authorization'] = `Bearer ${params.accessToken}`;
      }

      const sse = new EventSource(url, {
        headers,
      });

      sse.addEventListener('open', () => {
        resolve();
      });
    });
  }
}
