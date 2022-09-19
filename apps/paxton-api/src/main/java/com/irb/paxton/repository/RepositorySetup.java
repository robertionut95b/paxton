package com.irb.paxton.repository;

import com.irb.paxton.baseEntity.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import static com.irb.paxton.config.Constants.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_REPOSITORY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RepositorySetup extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @NotNull
    private boolean isActive;

    @NotNull
    private boolean isOwned;

    @NotNull
    private boolean isCompleted;
}
