package com.irb.paxton.core.messaging;

import com.irb.paxton.core.messaging.type.ChatType;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.Optional;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = "PX_CHAT")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Chat extends PaxtonEntity<Long> {

    @OneToMany(mappedBy = "chat", cascade = CascadeType.ALL, orphanRemoval = true)
    private Collection<Message> messages = new ArrayList<>();

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    @JoinTable(name = TABLE_PREFIX + "_CHAT_USERS",
            joinColumns = @JoinColumn(name = "chat_id"),
            inverseJoinColumns = @JoinColumn(name = "users_id"),
            indexes = {
                    @Index(name = "idx_chat_users", columnList = "chat_id, users_id", unique = true)
            }
    )
    @NotNull
    @NotEmpty
    @Size(min = 2, message = "Chat must have at least {min} users")
    private Collection<User> users = new ArrayList<>();

    @Column(length = 25)
    @Size(min = 3, max = 25)
    private String title;

    @NotNull
    @Enumerated
    private ChatType chatType;

    @Transient
    private Message latestMessage;

    @Transient
    private long unreadMessagesCount;

    public Chat(Collection<Message> messages, Collection<User> users, ChatType chatType) {
        this.messages = messages;
        this.users = users;
        this.chatType = chatType;
    }

    public Chat addMessage(Message message) {
        if (!this.getMessages().contains(message)) {
            this.messages.add(message);
        }
        return this;
    }

    public Chat removeMessage(Message message) {
        this.messages.remove(message);
        return this;
    }

    public Chat markMessageAsSeenByUser(Message message, User user) {
        this.messages
                .stream()
                .filter(m -> m.equals(message))
                .findFirst()
                .ifPresent(m -> m.markAsSeenBy(user));
        return this;
    }

    public Chat markAllMessagesAsSeenByUser(User user) {
        this.messages
                .stream()
                .filter(m -> !m.getSender().getUsername().equals(user.getUsername()))
                .filter(m -> m.getSeenBy().stream().noneMatch(ms -> ms.getUser().getUsername().equals(user.getUsername())))
                .forEach(m -> this.markMessageAsSeenByUser(m, user));
        return this;
    }

    @PostLoad
    private void onLoad() {
        Optional<String> usernameOpt = SecurityUtils.getCurrentUserLogin();
        this.latestMessage = messages.stream()
                .max(Comparator.comparing(Message::getDeliveredAt))
                .orElse(null);
        if (usernameOpt.isPresent()) {
            String username = usernameOpt.get();
            this.unreadMessagesCount = messages.stream()
                    .filter(m -> m.getSender() != null && !m.getSender().getUsername().equals(username))
                    .filter(m -> m.getSeenBy().stream().noneMatch(ms -> ms.getUser().getUsername().equals(username)))
                    .count();
        } else this.unreadMessagesCount = 0;
    }
}
