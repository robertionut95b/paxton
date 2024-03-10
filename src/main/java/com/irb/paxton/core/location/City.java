package com.irb.paxton.core.location;

import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serial;

@Entity
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
