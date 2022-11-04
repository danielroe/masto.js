import 'isomorphic-form-data';

import { MastoClient } from '../clients';
import { MastoConfig } from '../config';
import {
  // EventTargetServerSentNodejsImpl,
  EventTargetWebSocketNodejsImpl,
} from '../events';
import { HttpAxiosImpl } from '../http';
import { InstanceRepository } from '../repositories';
import { SerializerNodejsImpl } from '../serializers';

export const login = async (config: MastoConfig): Promise<MastoClient> => {
  const serializer = new SerializerNodejsImpl();
  const http = new HttpAxiosImpl(config, serializer);
  const instance = await new InstanceRepository(http, '1.0.0').fetch();
  // console.log('instance.uri --> ', instance.uri);
  const ws = new EventTargetWebSocketNodejsImpl(
    instance.urls.streamingApi,
    instance.version,
    config,
    serializer,
  );

  return new MastoClient(http, ws, instance.version, config);
};

export * from '../decorators';
export * from '../entities';
export * from '../errors';
export * from '../http';
export * from '../repositories';
export * from '../serializers';
export * from '../events';
export * from '../clients';
export * from '../config';
export * from '../paginator';
export * from '../repository';
