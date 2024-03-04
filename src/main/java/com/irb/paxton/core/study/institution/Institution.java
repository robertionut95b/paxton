package com.irb.paxton.core.study.institution;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.study.Study;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_INSTITUTION")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Institution extends PaxtonEntity {

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    private String photography;

    @OneToMany(mappedBy = "institution", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private Collection<Study> studies;
}
