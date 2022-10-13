package com.irb.paxton.core.process;

import com.irb.paxton.core.base.BaseEntity;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_STEP")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Step extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotBlank
    @NotEmpty
    @NotNull
    private String title;

    @NotBlank
    @NotEmpty
    @NotNull
    @Length(min = 10)
    private String description;

    @OneToMany(mappedBy = "step")
    private Collection<ProcessSteps> processSteps;

    public Step(Long id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}
