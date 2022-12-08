package com.irb.paxton.core.connection;

import com.irb.paxton.core.base.BaseEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.*;

import javax.persistence.*;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CONNECTIONS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Connection extends BaseEntity {

    @Setter(AccessLevel.NONE)
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "px_connection_id_seq")
    @SequenceGenerator(name = "px_connection_id_seq", allocationSize = 1)
    @Column(name = "id", nullable = false)
    private Long id;

    @OneToOne
    @JoinColumn(name = "first_user_id")
    private User firstUser;

    @OneToOne
    @JoinColumn(name = "second_user_id")
    private User secondUser;

}
