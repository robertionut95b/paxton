package com.irb.paxton.process;

import com.irb.paxton.base.BaseEntity;
import lombok.*;

import javax.persistence.*;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROCESS_STEPS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ProcessSteps extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "process_id")
    private Process process;

    @ManyToOne
    @JoinColumn(name = "step_id")
    private Step step;

    @Column(nullable = false, name = "step_order")
    private int order = 1;
}
