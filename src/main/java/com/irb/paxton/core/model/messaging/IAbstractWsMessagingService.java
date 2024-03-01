package com.irb.paxton.core.model.messaging;

import com.irb.paxton.core.model.Identifiable;
import reactor.core.publisher.ConnectableFlux;

public interface IAbstractWsMessagingService<I, T extends Identifiable<I>> {

    ConnectableFlux<T> joinChannel(I identifier);

    void publishMessageToChannel(I identifier, T message);
}
