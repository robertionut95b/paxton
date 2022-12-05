package com.irb.paxton.core.organization;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.*;

import javax.persistence.*;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_RECRUITER")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Recruiter extends BaseEntity {
    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}
