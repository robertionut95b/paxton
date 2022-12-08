package com.irb.paxton.repository;

import com.irb.paxton.core.base.BaseEntity;
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
public class RepositorySetup extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "px_repository_setup_id_seq")
    @SequenceGenerator(name = "px_repository_setup_id_seq", allocationSize = 1)
    private Long id;

    @NotNull
    private boolean isActive;

    @NotNull
    private boolean isOwned;

    @NotNull
    private boolean isCompleted;
}
