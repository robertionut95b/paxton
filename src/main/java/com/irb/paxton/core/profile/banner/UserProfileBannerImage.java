package com.irb.paxton.core.profile.banner;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.model.storage.AbstractFileEntity;
import com.irb.paxton.core.model.storage.FileType;
import com.irb.paxton.core.profile.UserProfile;
import com.irb.paxton.core.profile.listener.BannerImageUrlServiceableListener;
import com.irb.paxton.storage.FileProvider;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
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
@EntityListeners(BannerImageUrlServiceableListener.class)
public class UserProfileBannerImage extends AbstractFileEntity {

    @ManyToOne
    @JoinColumn(name = "user_profile_id", nullable = false)
    @JsonBackReference
    private UserProfile userProfile;

    @Transient
    private String url;

    public UserProfileBannerImage(@NotNull @NotEmpty @NotBlank String name,
                                  @NotNull @NotEmpty @NotBlank String path,
                                  @NotNull FileType fileType,
                                  @NotNull FileProvider provider,
                                  UserProfile userProfile) {
        super(name, path, fileType, provider);
        this.userProfile = userProfile;
    }
}
