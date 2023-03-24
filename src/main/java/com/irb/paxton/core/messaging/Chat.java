package com.irb.paxton.core.messaging;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CHAT")
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
            inverseJoinColumns = @JoinColumn(name = "users_id"))
    private Collection<User> users = new ArrayList<>();

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
}
