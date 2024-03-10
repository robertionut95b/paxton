package com.irb.paxton.core.activity;

import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.Entity;
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
public class ActivitySector extends PaxtonEntity {

    @Serial
    private static final long serialVersionUID = 4678211111830580602L;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;
}
