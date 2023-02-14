package com.irb.paxton.core.location;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serial;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CITY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class City extends PaxtonEntity<Long> {

    @Serial
    private static final long serialVersionUID = -955835556188772208L;

    @NotBlank
    @NotEmpty
    @NotNull
    @Column(unique = true)
    private String name;

    @ManyToOne
    @JoinColumn(name = "country_code")
    private Country country;
}
