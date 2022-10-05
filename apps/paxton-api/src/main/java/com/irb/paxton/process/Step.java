package com.irb.paxton.process;

import com.irb.paxton.base.BaseEntity;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.Min;
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
    @Min(value = 5)
    private String title;

    @OneToMany(mappedBy = "step")
    private Collection<ProcessSteps> processSteps;
}
