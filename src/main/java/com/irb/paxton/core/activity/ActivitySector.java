package com.irb.paxton.core.activity;

import com.irb.paxton.core.base.BaseEntity;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_ACTIVITY_SECTOR")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ActivitySector extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;
}
