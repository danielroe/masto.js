import EventEmitter from 'eventemitter3';

import { Conversation, Notification, Status } from '../entities';

/** Map of event name and callback argument */
export interface EventTypeMap {
  /** Status posted */
  update: [Status];
  /** Status deleted */
  delete: [Status['id']];
  /** User's notification */
  notification: [Notification];
  /** User's filter changed */
  filters_changed: [];
  /** Status added to a conversation */
  conversation: [Conversation];
  /** Status updated */
  'status.update': [Status];
  /** for RxJS' `fromEvent` compatibility */
  [K: string]: unknown[];
}

/** Supported event names */
export type EventType = keyof EventTypeMap;

/** Mastodon event */
export interface Event {
  event: EventType;
  payload: string;
}

export interface EventTarget extends Omit<EventEmitter<EventTypeMap>, 'on'> {
  connect(path: string, params?: unknown): Promise<this>;
  disconnect(): void;
  // eslint-disable-next-line prettier/prettier
  on<T extends EventType>(name: T, cb: (...data: EventTypeMap[T]) => void): void;
}
