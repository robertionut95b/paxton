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
@Table(name = TABLE_PREFIX + "_CONNECTION_REQUESTS")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class ConnectionRequest extends PaxtonEntity<Long> {

    @OneToOne
    @JoinColumn(name = "requester_user_id")
    private User requester;

    @OneToOne
    @JoinColumn(name = "addressed_user_id")
    private User addressed;

    @Enumerated(value = EnumType.STRING)
    private ConnectionStatus connectionStatus = ConnectionStatus.REQUESTED;
}
