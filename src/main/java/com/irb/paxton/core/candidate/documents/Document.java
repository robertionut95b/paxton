package com.irb.paxton.core.candidate.documents;

import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@Getter
@Setter
public class Document extends PaxtonEntity {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    private String url;

    public Document(String name, String url) {
        this.name = name;
        this.url = url;
    }

}
