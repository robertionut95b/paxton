package com.irb.paxton.study;

import com.irb.paxton.base.BaseEntity;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_STUDY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Study extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToMany(mappedBy = "profile")
    private Collection<ProfileStudies> profiles;

    @NotBlank
    @NotNull
    @NotEmpty
    private String name;

    private String description;
}