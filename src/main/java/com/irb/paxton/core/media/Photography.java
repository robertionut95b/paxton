package com.irb.paxton.core.media;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.profile.UserProfile;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_USER_PHOTOGRAPHY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Photography extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "px_photography_id_seq")
    @SequenceGenerator(name = "px_photography_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    private String path;

    @OneToOne
    @JoinColumn(name = "user_profile_id")
    @JsonBackReference
    private UserProfile userProfile;
}
