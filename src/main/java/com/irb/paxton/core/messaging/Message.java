package com.irb.paxton.core.messaging;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.irb.paxton.core.messaging.jpalisteners.MessageEntityListener;
import com.irb.paxton.core.messaging.validator.ContentOrFileRequiredValidation;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.time.OffsetDateTime;
import java.util.HashSet;
import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EntityListeners(MessageEntityListener.class)
@ContentOrFileRequiredValidation
public class Message extends PaxtonEntity {

    @Lob
    private String content;

    @JsonBackReference("sender")
    @ManyToOne
    @JoinColumn(name = "sender_id")
    @NotNull
    private User sender;

    @NotNull
    private OffsetDateTime deliveredAt = OffsetDateTime.now();

    @JsonManagedReference("seenBy")
    @ManyToMany(mappedBy = "message", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.DETACH})
    private Set<MessageSeenBy> seenBy = new LinkedHashSet<>();

    @Transient
    private OffsetDateTime seenAt = null;

    @JsonBackReference("chat")
    @ManyToOne(cascade = CascadeType.ALL, optional = false)
    @JoinColumn(name = "chat_id", nullable = false)
    private Chat chat;

    @JsonManagedReference("fileContents")
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "message", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<MessageFile> fileContents = new HashSet<>();

    public Message markAsSeenBy(User user) {
        Set<MessageSeenBy> currentSeens = this.getSeenBy();
        currentSeens.add(new MessageSeenBy(user, this, OffsetDateTime.now()));
        this.setSeenBy(currentSeens);
        return this;
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
        messageFile.setMessage(this);
        this.fileContents.add(messageFile);
    }
}
