package com.irb.paxton.core.study.domain;

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
@Table(name = TABLE_PREFIX + "_DOMAIN")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Domain extends PaxtonEntity {

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "domainStudy", cascade = {CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    private Collection<Study> studies;
}
