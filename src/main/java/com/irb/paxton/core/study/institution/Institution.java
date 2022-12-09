package com.irb.paxton.core.study.institution;

import com.irb.paxton.auditable.AuditableEntity;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.study.Study;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_INSTITUTION")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Institution extends PaxtonEntity<Long> {

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String name;

    @Column(length = 1000)
    private String description;

    private String photography;

    @OneToMany(mappedBy = "institution")
    private Collection<Study> studies;
}
