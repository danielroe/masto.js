import WebSocket from 'isomorphic-ws';

import { MastoConfig } from '../config';
import { Serializer } from '../serializers';
import { BaseEventTarget } from './base-event-target';
import { Event, EventTarget, EventType, EventTypeMap } from './event-target';

/**
 * Mastodon streaming api wrapper
 */
export class EventTargetWebSocketNodejsImpl
  extends BaseEventTarget
  implements EventTarget
{
  private ws?: WebSocket;

  constructor(
    protected readonly baseUrl: string,
    protected readonly version: string,
    protected readonly config: MastoConfig,
    protected readonly serializer: Serializer,
  ) {
    super();
  }

  /**
   * Connect to the websocket endpoint
   */
  connect(path: string, params?: Record<string, unknown>) {
    const url = this.resolveUrl(path);
    const protocols = this.createProtocols();

    console.log({ url, protocols });

    return new Promise<this>((resolve, reject) => {
      this.ws = new WebSocket(url, protocols, {
        headers: { Connection: 'Upgrade', Upgrade: 'websocket' },
      });
      this.ws.addEventListener('message', this.handleMessage);
      this.ws.addEventListener('error', reject);
      this.ws.addEventListener('open', () => {
        console.log('sending --> ', { type: 'subscribe', ...params });
        this.ws?.send({ type: 'subscribe', ...params }, (error) => {
          if (error) reject(error);
          resolve(this);
        });
      });
    });
  }

  /**
   * Disconnect from the websocket endpoint
   */
  disconnect() {
    if (!this.ws) return;
    this.ws.close();
  }

  /**
   * Parse JSON data and emit it as an event
   * @param message Websocket message
   */
  private handleMessage = ({ data }: WebSocket.MessageEvent) => {
    const event = this.serializer.deserialize<Event>('application/json', data);
    let args: EventTypeMap[EventType] = [];

    try {
      args.push(this.serializer.deserialize('application/json', event.payload));
    } catch {
      args = [];
    }

    this.emit(event.event, ...args);
  };
}
