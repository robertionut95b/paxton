package com.irb.paxton.core.study.certification;

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
@Table(name = TABLE_PREFIX + "_CERTIFICATION")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Certification extends BaseEntity {

    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "px_certification_id_seq")
    @SequenceGenerator(name = "px_certification_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "certification")
    private Collection<Study> studies;
}
