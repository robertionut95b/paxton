package com.irb.paxton.core.model.messaging;

import com.irb.paxton.core.model.Identifiable;
import reactor.core.publisher.ConnectableFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

public class AbstractWsMessagingService<I, T extends Identifiable<I>> implements IAbstractWsMessagingService<I, T> {

    private final Map<I, ConnectableFlux<T>> fluxMap;

    private final Map<I, FluxSink<T>> sinkMap;

    public AbstractWsMessagingService() {
        this.fluxMap = new ConcurrentHashMap<>();
        this.sinkMap = new ConcurrentHashMap<>();
    }

    @Override
    public ConnectableFlux<T> joinChannel(I identifier) {
        // check if a room is already available
        ConnectableFlux<T> individualChannel = fluxMap.get(identifier);
        if (individualChannel == null) {
            Flux<T> publisher = null;
            AtomicReference<FluxSink<T>> sinkStream = new AtomicReference<>(sinkMap.get(identifier));

            if (sinkStream.get() == null) {
                publisher = Flux.create(sinkStream::set);
            }
            assert publisher != null;

            individualChannel = publisher.publish();
            individualChannel.connect();
            fluxMap.put(identifier, individualChannel);
            sinkMap.put(identifier, sinkStream.get());
        }
        return individualChannel;
    }

    @Override
    public void publishMessageToChannel(I identifier, T message) {
        FluxSink<T> updatesStream = sinkMap.get(identifier);
        if (updatesStream != null) {
            updatesStream.next(message);
        }
    }
}
