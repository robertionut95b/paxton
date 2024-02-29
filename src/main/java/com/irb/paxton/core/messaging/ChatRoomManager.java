package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.dto.ChatLiveUpdateDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import reactor.core.publisher.ConnectableFlux;
import reactor.core.publisher.Flux;
import reactor.core.publisher.FluxSink;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicReference;

@Slf4j
@Component
public class ChatRoomManager {

    private final Map<Long, ConnectableFlux<Message>> chatRooms;

    private final Map<Long, ConnectableFlux<ChatLiveUpdateDto>> chatUpdateChannels;

    private final Map<Long, FluxSink<ChatLiveUpdateDto>> chatUpdateStreams;

    private final Map<Long, FluxSink<Message>> chatStreams;

    public ChatRoomManager() {
        this.chatUpdateChannels = new ConcurrentHashMap<>();
        this.chatUpdateStreams = new ConcurrentHashMap<>();
        this.chatRooms = new ConcurrentHashMap<>();
        this.chatStreams = new ConcurrentHashMap<>();
    }

    // Method to join a chat room
    public ConnectableFlux<Message> joinRoom(Long roomId) {
        // check if a room is already available
        ConnectableFlux<Message> chatRoom = chatRooms.get(roomId);
        if (chatRoom == null) {
            Flux<Message> publisher = null;
            AtomicReference<FluxSink<Message>> chatStream = new AtomicReference<>(chatStreams.get(roomId));
            if (chatStream.get() == null) {
                publisher = Flux.create(chatStream::set);
            }
            chatRoom = publisher.publish();
            chatRoom.connect();
            chatRooms.put(roomId, chatRoom);
            chatStreams.put(roomId, chatStream.get());
            log.debug("Chat room created for %d. Initiating...".formatted(roomId));
        }
        return chatRoom;
    }

    // publish messages to chat rooms
    public void publishMessageToRoom(Long roomId, Message message) {
        FluxSink<Message> chatStream = chatStreams.get(roomId);
        if (chatStream != null) {
            chatStream.next(message);
            log.debug("Message [%d bytes] sent to chat room %d"
                    .formatted(message.getContent().getBytes().length, roomId));
        }
    }

    public ConnectableFlux<ChatLiveUpdateDto> joinSseChatUpdatesSinkByUser(Long userId) {
        // check if a room is already available
        ConnectableFlux<ChatLiveUpdateDto> chatUpdates = chatUpdateChannels.get(userId);
        if (chatUpdates == null) {
            Flux<ChatLiveUpdateDto> publisher = null;
            AtomicReference<FluxSink<ChatLiveUpdateDto>> chatUpdatesStream = new AtomicReference<>(chatUpdateStreams.get(userId));
            if (chatUpdatesStream.get() == null) {
                publisher = Flux.create(chatUpdatesStream::set);
            }
            chatUpdates = publisher.publish();
            chatUpdates.connect();
            chatUpdateChannels.put(userId, chatUpdates);
            chatUpdateStreams.put(userId, chatUpdatesStream.get());
            log.debug("Chat updates stream created for userId=%d. Initiating...".formatted(userId));
        }
        return chatUpdates;
    }

    public void streamChatUpdateFluxToUser(Long userId, ChatLiveUpdateDto chatUpdate) {
        FluxSink<ChatLiveUpdateDto> chatUpdatesStream = chatUpdateStreams.get(userId);
        if (chatUpdatesStream != null) {
            chatUpdatesStream.next(chatUpdate);
            log.debug("Chat update [%d bytes] sent to userId=%d"
                    .formatted(chatUpdate.toString().getBytes().length, userId));
        }
    }

}
