package com.irb.paxton.core.profile;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.core.location.City;
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
@Table(name = TABLE_PREFIX + "_USER_PROFILE", indexes = @Index(columnList = "profileSlugUrl"))
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

    @OneToOne
    @JoinColumn(name = "user_id")
    @NotNull
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

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
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

    @PrePersist
    void preInsert() {
        if (this.profileSlugUrl == null) {
            this.profileSlugUrl = this.getUser().getUsername() + System.currentTimeMillis();
        }
    }
}
