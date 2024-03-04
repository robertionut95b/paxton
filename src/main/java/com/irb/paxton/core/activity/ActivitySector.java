package com.irb.paxton.core.activity;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.io.Serial;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_ACTIVITY_SECTOR")
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
