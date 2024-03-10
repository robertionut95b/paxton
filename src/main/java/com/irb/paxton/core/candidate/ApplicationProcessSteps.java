package com.irb.paxton.core.candidate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.process.ProcessSteps;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.time.OffsetDateTime;
import java.util.Objects;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ApplicationProcessSteps extends PaxtonEntity implements Comparable<ApplicationProcessSteps> {

    @JsonBackReference(value = "processStep")
    @ManyToOne
    @JoinColumn(name = "process_step_id")
    private ProcessSteps processStep;

    @JsonBackReference(value = "applicationProcessSteps")
    @ManyToOne
    @JoinColumn(name = "application_id")
    private Application application;

    @NotNull
    private OffsetDateTime registeredAt = OffsetDateTime.now();

    public ApplicationProcessSteps(ProcessSteps processStep) {
        this.processStep = processStep;
    }

    @Override
    public int compareTo(@NotNull ApplicationProcessSteps o) {
        return this.getProcessStep().compareTo(o.getProcessStep());
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ApplicationProcessSteps that = (ApplicationProcessSteps) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}
