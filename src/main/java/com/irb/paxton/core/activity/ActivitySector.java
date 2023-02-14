package com.irb.paxton.core.activity;

import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.io.Serial;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_ACTIVITY_SECTOR")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ActivitySector extends PaxtonEntity<Long> {

    @Serial
    private static final long serialVersionUID = 4678211111830580602L;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;
}
