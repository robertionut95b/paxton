package com.irb.paxton.core.profile;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.irb.paxton.core.location.City;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.profile.avatar.UserProfileAvatarImage;
import com.irb.paxton.core.profile.banner.UserProfileBannerImage;
import com.irb.paxton.core.profile.experience.Experience;
import com.irb.paxton.core.study.Study;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.utils.StringUtils;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Collection;

@Entity
@Table(indexes = @Index(columnList = "profileSlugUrl"))
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UserProfile extends PaxtonEntity {

    @OneToOne
    @JoinColumn(name = "user_id")
    @NotNull
    private User user;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn
    @JsonManagedReference
    private UserProfileAvatarImage userProfileAvatarImage;

    @ManyToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn
    @JsonManagedReference
    private UserProfileBannerImage userProfileBannerImage;

    @Column(length = 1000)
    private String description;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;

    @NotNull
    @NotEmpty
    @NotBlank
    @Column(unique = true)
    private String profileSlugUrl;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL)
    @OrderBy(value = "startDate DESC")
    private Collection<Study> studies;

    @NotBlank
    @NotEmpty
    private String profileTitle;

    @OneToMany(mappedBy = "userProfile", cascade = CascadeType.ALL)
    @OrderBy(value = "startDate DESC")
    private Collection<Experience> experiences;

    public UserProfile(User user) {
        this.user = user;
    }

    @PrePersist
    void preInsert() {
        if (this.profileSlugUrl == null) {
            this.profileSlugUrl = StringUtils.slugifyString(this.getUser().getUsername() + System.currentTimeMillis());
        }
        this.setCreatedBy(this.user.getUsername());
        this.setModifiedBy(this.user.getUsername());
    }
}
