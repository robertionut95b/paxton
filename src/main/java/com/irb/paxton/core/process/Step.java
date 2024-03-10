package com.irb.paxton.core.process;

import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import java.util.Collection;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Step extends PaxtonEntity {

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
