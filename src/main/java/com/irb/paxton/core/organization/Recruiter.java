package com.irb.paxton.core.organization;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_RECRUITER")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Recruiter extends PaxtonEntity<Long> {

    @ManyToOne
    @MapsId
    @JoinColumn(name = "id")
    private User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @NotNull
    private boolean isActive = true;

    private LocalDateTime lastActive;
}
