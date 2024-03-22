package com.irb.paxton.core.messaging;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.messaging.jpalisteners.MessageFileEntityListener;
import com.irb.paxton.core.model.storage.AbstractFileEntity;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.core.model.storage.ImageFile;
import com.irb.paxton.storage.FileProvider;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;
import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@EntityListeners(MessageFileEntityListener.class)
public class MessageFile extends AbstractFileEntity implements ImageFile {

    @Serial
    private static final long serialVersionUID = 5234472925877003401L;

    @JsonBackReference("fileContents")
    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Message message;

    @Transient
    private String url;

    @Basic(fetch = FetchType.LAZY)
    @PositiveOrZero
    @Min(0)
    private int width;

    @Basic(fetch = FetchType.LAZY)
    @PositiveOrZero
    @Min(0)
    private int height;

    @Basic(fetch = FetchType.LAZY)
    @PositiveOrZero
    @Min(0)
    private float quality;

    public MessageFile(@NotNull @NotEmpty @NotBlank String name,
                       @NotNull @NotEmpty @NotBlank String path,
                       @NotNull FileType fileType,
                       @NotNull FileProvider provider,
                       Message message) {
        super(name, path, fileType, provider);
        this.message = message;
    }

    public MessageFile(@NotNull @NotEmpty @NotBlank String name,
                       @NotNull @NotEmpty @NotBlank String path,
                       @NotNull FileType fileType,
                       @NotNull FileProvider provider,
                       Message message,
                       int width,
                       int height,
                       float quality) {
        super(name, path, fileType, provider);
        this.message = message;
        this.width = width;
        this.height = height;
        this.quality = quality;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof MessageFile that)) return false;
        return Objects.equals(id, that.id) && Objects.equals(urlId, that.urlId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, urlId);
    }

    @Override
    public int getWidth() {
        return width;
    }

    @Override
    public int getHeight() {
        return height;
    }

    @Override
    public float getQuality() {
        return quality;
    }
}
