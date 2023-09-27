package com.irb.paxton.core.candidate.documents;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_DOCUMENT")
@NoArgsConstructor
@Getter
@Setter
public class Document extends PaxtonEntity<Long> {

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
