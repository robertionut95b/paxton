package com.irb.paxton.repository;

import com.irb.paxton.core.model.PaxtonEntity;
import jakarta.persistence.Column;
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

    @Column(nullable = false, length = 1000)
    @NotNull
    private String details;

    @Column(name = "version", nullable = false, unique = true, length = 20)
    private String appVersion;

}
