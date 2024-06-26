package com.irb.paxton.core.model.storage;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.storage.FileProvider;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@MappedSuperclass
public abstract class AbstractFileEntity extends PaxtonEntity implements File {

    @Serial
    private static final long serialVersionUID = 7232999451691337839L;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    private String path;

    @NotNull
    private FileType fileType;

    @NotNull
    private FileProvider provider = FileProvider.LOCAL;
}
