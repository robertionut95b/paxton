package com.irb.paxton.core.candidate;

import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import jakarta.persistence.*;

import java.util.Collection;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CANDIDATE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Candidate extends PaxtonEntity {

    @OneToOne
    @MapsId
    @JoinColumn(name = "id", unique = true)
    private User user;

    @OneToMany(mappedBy = "candidate")
    private Collection<Application> applications;

}
