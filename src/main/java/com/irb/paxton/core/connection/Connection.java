package com.irb.paxton.core.connection;

import com.irb.paxton.core.connection.status.ConnectionStatus;
import com.irb.paxton.core.model.PaxtonEntity;
import com.irb.paxton.security.auth.user.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

import static com.irb.paxton.config.properties.ApplicationProperties.TABLE_PREFIX;

@Entity
@Table(name = TABLE_PREFIX + "_CONNECTIONS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Connection extends PaxtonEntity<Long> {

    @OneToOne
    @JoinColumn(name = "first_user_id")
    private User firstUser;

    @OneToOne
    @JoinColumn(name = "second_user_id")
    private User secondUser;

    @Enumerated(value = EnumType.STRING)
    private ConnectionStatus connectionStatus = ConnectionStatus.REQUESTED;
}
