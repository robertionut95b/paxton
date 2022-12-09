package com.irb.paxton.core.candidate;

import com.irb.paxton.auditable.AuditableEntity;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CANDIDATE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Candidate extends PaxtonEntity<Long> {

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "candidate")
    private Collection<Application> applications;

}
