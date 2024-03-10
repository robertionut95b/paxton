package com.irb.paxton.repository;

import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.Entity;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RepositorySetup extends PaxtonEntity {

    @NotNull
    private boolean isActive;

    @NotNull
    private boolean isOwned;

    @NotNull
    private boolean isCompleted;
}
