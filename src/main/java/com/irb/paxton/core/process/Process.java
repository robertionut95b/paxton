package com.irb.paxton.core.process;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.organization.Organization;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.validator.constraints.Length;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_PROCESS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Process extends PaxtonEntity<Long> {

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
