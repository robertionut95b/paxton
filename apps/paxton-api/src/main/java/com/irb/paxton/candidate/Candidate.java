package com.irb.paxton.candidate;

import com.irb.paxton.base.BaseEntity;
import com.irb.paxton.process.ProcessUsers;
import com.irb.paxton.security.auth.user.User;
import lombok.*;

import javax.persistence.*;
import java.util.Collection;

import static com.irb.paxton.config.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CANDIDATE")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Candidate extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "candidate")
    private Collection<ProcessUsers> processUsers;

}
