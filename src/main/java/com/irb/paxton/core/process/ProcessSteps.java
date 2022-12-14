package com.irb.paxton.core.process;

import com.irb.paxton.auditable.AuditableEntity;
import com.irb.paxton.core.model.PaxtonEntity;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROCESS_STEPS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProcessSteps extends PaxtonEntity<Long> {

    @ManyToOne
    @JoinColumn(name = "process_id")
    private Process process;

    @ManyToOne
    @JoinColumn(name = "step_id")
    private Step step;

    @NotNull
    @Enumerated
    private Status status;

    @Column(nullable = false, name = "step_order")
    private int order = 1;
}
