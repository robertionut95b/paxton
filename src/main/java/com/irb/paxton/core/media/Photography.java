package com.irb.paxton.core.media;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.core.profile.UserProfile;
import jakarta.persistence.Entity;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_USER_PHOTOGRAPHY")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Photography extends PaxtonEntity<Long> {

    @NotNull
    @NotEmpty
    @NotBlank
    private String name;

    @NotNull
    @NotEmpty
    @NotBlank
    private String path;

    @ManyToOne
    @JoinColumn(name = "user_profile_id")
    @JsonBackReference
    private UserProfile userProfile;
}
