package com.irb.paxton.core.profile;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.profile.experience.Experience;
import com.irb.paxton.core.study.ProfileStudies;
import com.irb.paxton.security.auth.user.User;
import lombok.*;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_USER_PROFILE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserProfile extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Column(nullable = true)
    private String photography;

    @Column(nullable = true)
    private String coverPhotography;

    @NotNull
    @NotEmpty
    @NotBlank
    @Lob
    private String description;

    @NotNull
    @NotEmpty
    @NotBlank
    private String location;

    @NotNull
    @NotEmpty
    @NotBlank
    private String profileSlugUrl;

    @OneToMany(mappedBy = "study")
    private Collection<ProfileStudies> studies;

    @NotBlank
    @NotEmpty
    private String profileTitle;

    @OneToMany(mappedBy = "userProfile")
    private Collection<Experience> experiences;

    public UserProfile(User user) {
        this.user = user;
    }
}
