package com.irb.paxton.core.location;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serial;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CITY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class City extends PaxtonEntity {

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

    private Double longitude;

    private Double latitude;
}
