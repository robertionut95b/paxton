package com.irb.paxton.repository;

import com.irb.paxton.auditable.AuditableEntity;
import com.irb.paxton.core.model.PaxtonEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_REPOSITORY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RepositorySetup extends PaxtonEntity<Long> {

    @NotNull
    private boolean isActive;

    @NotNull
    private boolean isOwned;

    @NotNull
    private boolean isCompleted;
}
