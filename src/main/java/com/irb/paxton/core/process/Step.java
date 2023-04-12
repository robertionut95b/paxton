package com.irb.paxton.core.process;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_STEP")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Step extends PaxtonEntity<Long> {

    @NotBlank
    @NotEmpty
    @NotNull
    @Column(unique = true)
    @Length(min = 2, max = 15)
    private String title;

    @NotBlank
    @NotEmpty
    @NotNull
    @Length(min = 3, max = 150)
    private String description;

    @OneToMany(mappedBy = "step")
    private Collection<ProcessSteps> processSteps;

    public Step(Long id, String title, String description) {
        this.id = id;
        this.title = title;
        this.description = description;
    }
}
