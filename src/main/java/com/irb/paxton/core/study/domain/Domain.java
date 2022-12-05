package com.irb.paxton.core.study.domain;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.study.Study;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_DOMAIN")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Domain extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "domainStudy")
    private Collection<Study> studies;
}
