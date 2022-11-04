import { SerializerNodejsImpl } from '../serializers';
import { BaseEventTarget } from './base-event-target';
import { EventTarget } from './event-target';

export const wsDisconnect = jest.fn();
export const wsOn = jest.fn();
export const wsStream = jest.fn();

export class EventTargetMockImpl
  extends BaseEventTarget
  implements EventTarget
{
  baseUrl = 'wss://mastodon.social';
  config = {
    url: 'https://mastodon.social',
    accessToken: 'token',
  };
  serializer = new SerializerNodejsImpl();
  version = '99.99.9';
  connect = jest.fn();
  disconnect = wsDisconnect;
  on = wsOn;
}
