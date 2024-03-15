package com.irb.paxton.core.messaging;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.messaging.jpalisteners.MessageFileEntityListener;
import com.irb.paxton.core.model.storage.AbstractFileEntity;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.storage.FileProvider;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EntityListeners(MessageFileEntityListener.class)
public class MessageFile extends AbstractFileEntity {

    @Serial
    private static final long serialVersionUID = 5234472925877003401L;

    @JsonBackReference
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "message_id")
    private Message message;

    @Transient
    private String url;

    public MessageFile(@NotNull @NotEmpty @NotBlank String name,
                       @NotNull @NotEmpty @NotBlank String path,
                       @NotNull FileType fileType,
                       @NotNull FileProvider provider,
                       Message message) {
        super(name, path, fileType, provider);
        this.message = message;
    }
}
