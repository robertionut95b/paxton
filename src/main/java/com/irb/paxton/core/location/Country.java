package com.irb.paxton.core.location;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.NaturalId;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.HashSet;
import java.util.Set;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_COUNTRY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Country extends PaxtonEntity<Long> {

    @NaturalId
    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String code;

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String name;

    @OneToMany(mappedBy = "country", cascade = CascadeType.ALL)
    private Set<City> cities = new HashSet<>();
}
