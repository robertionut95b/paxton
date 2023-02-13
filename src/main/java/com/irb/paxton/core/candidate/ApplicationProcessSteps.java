package com.irb.paxton.core.candidate;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.process.ProcessSteps;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import java.time.OffsetDateTime;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_APPLICATION_PROCESS_STEPS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApplicationProcessSteps extends PaxtonEntity<Long> {

    @ManyToOne
    @JoinColumn(name = "process_step_id")
    private ProcessSteps processStep;

    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @NotNull
    private OffsetDateTime registeredAt = OffsetDateTime.now();

    public ApplicationProcessSteps(ProcessSteps processStep) {
        this.processStep = processStep;
    }
}
