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
@Table(name = TABLE_PREFIX + "_PROCESS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Process extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    @Min(value = 5)
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    @Min(value = 10)
    private String description;

    @OneToMany(mappedBy = "process")
    private Collection<ProcessSteps> processSteps;

    @OneToMany(mappedBy = "process")
    private Collection<ProcessUsers> processUsers;
}
