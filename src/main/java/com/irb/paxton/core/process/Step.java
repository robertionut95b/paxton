package com.irb.paxton.core.process;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
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
    @Length(min = 2, max = 25)
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
