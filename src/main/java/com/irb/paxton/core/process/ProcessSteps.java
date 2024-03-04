package com.irb.paxton.core.process;

import com.irb.paxton.core.candidate.ApplicationProcessSteps;
import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.Hibernate;

import java.util.Collection;
import java.util.Objects;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROCESS_STEPS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProcessSteps extends PaxtonEntity implements Comparable<ProcessSteps> {

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

    @OneToMany(mappedBy = "processStep", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private Collection<ApplicationProcessSteps> applications;

    public ProcessSteps(Process process, Step step, Status status, int order) {
        this.process = process;
        this.step = step;
        this.status = status;
        this.order = order;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || Hibernate.getClass(this) != Hibernate.getClass(o)) return false;
        ProcessSteps that = (ProcessSteps) o;
        return id != null && Objects.equals(id, that.id);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }

    @Override
    public int compareTo(@NotNull ProcessSteps o) {
        return Integer.compare(this.getOrder(), o.getOrder());
    }
}
