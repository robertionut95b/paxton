package com.irb.paxton.core.profile;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.core.study.ProfileStudies;
import lombok.*;
import org.springframework.lang.Nullable;

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

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Nullable
    private String photography;

    private String description;

    @NotNull
    @NotEmpty
    @NotBlank
    private String profileSlugUrl;

    @OneToMany(mappedBy = "study")
    private Collection<ProfileStudies> studies;

    @NotBlank
    @NotEmpty
    private String profileTitle;

    public UserProfile(User user) {
        this.user = user;
    }
}
