package com.irb.paxton.core.messaging;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.irb.paxton.core.messaging.jpalisteners.MessageEntityListener;
import com.irb.paxton.core.messaging.validator.ContentOrFileRequiredValidation;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.SecurityUtils;
import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.time.OffsetDateTime;
import java.util.*;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_MESSAGE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EntityListeners(MessageEntityListener.class)
@ContentOrFileRequiredValidation
public class Message extends PaxtonEntity {

    @Lob
    private String content;

    @ManyToOne
    @JoinColumn(name = "sender_id")
    @NotNull
    private User sender;

    @NotNull
    private OffsetDateTime deliveredAt = OffsetDateTime.now();

    @ManyToMany(mappedBy = "message", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private Set<MessageSeenBy> seenBy = new LinkedHashSet<>();

    @Transient
    private OffsetDateTime seenAt = null;

    @ManyToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @JsonManagedReference
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MessageFile> fileContents = new HashSet<>();

    public Message markAsSeenBy(User user) {
        Set<MessageSeenBy> currentSeens = this.getSeenBy();
        currentSeens.add(new MessageSeenBy(user, this, OffsetDateTime.now()));
        this.setSeenBy(currentSeens);
        return this;
    }

    @PostLoad
    public void onLoad() {
        Optional<String> usernameOpt = SecurityUtils.getCurrentUserLogin();
        if (usernameOpt.isPresent()) {
            String username = usernameOpt.get();
            this.seenAt = this.seenBy.stream()
                    .filter(ms -> ms.getMessage().getId().equals(this.getId()))
                    .filter(ms -> ms.getUser().getUsername().equals(username))
                    .max(Comparator.comparing(MessageSeenBy::getSeenAt))
                    .map(MessageSeenBy::getSeenAt)
                    .orElse(null);
        }
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        Message message = (Message) o;
        return id != null && Objects.equals(id, message.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    public void addFileContent(MessageFile messageFile) {
        this.fileContents.add(messageFile);
    }
}
