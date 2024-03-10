package com.irb.paxton.core.messaging;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.model.storage.AbstractFileEntity;
import com.irb.paxton.core.model.storage.FileType;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
public class MessageFile extends AbstractFileEntity {

    @Serial
    private static final long serialVersionUID = 5234472925877003401L;

    @JsonBackReference
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "message_id")
    private Message message;

    public MessageFile(@NotNull @NotEmpty @NotBlank String name,
                       @NotNull @NotEmpty @NotBlank String path,
                       @NotNull FileType fileType,
                       Message message) {
        super(name, path, fileType);
        this.message = message;
    }
}
