package com.irb.paxton.core.organization;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.*;
import org.springframework.lang.Nullable;

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
public class Recruiter extends BaseEntity {

    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "px_recruiter_id_seq")
    @SequenceGenerator(name = "px_recruiter_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @NotNull
    private boolean isActive = true;

    @Nullable
    private LocalDateTime lastActive;
}
