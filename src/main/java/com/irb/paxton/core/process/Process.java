package com.irb.paxton.core.process;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.organization.Organization;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROCESS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Process extends PaxtonEntity {

    @NotNull
    @NotEmpty
    @NotBlank
    @Length(min = 5)
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    @Length(min = 10)
    private String description;

    @OneToMany(mappedBy = "process", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private Collection<ProcessSteps> processSteps;

    @OneToMany(mappedBy = "recruitmentProcess", cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.REFRESH})
    private Collection<Organization> organizations;
}
