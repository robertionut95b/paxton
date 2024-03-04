package com.irb.paxton.security.auth.device;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserDeviceRepository extends AbstractRepository<UserDevice> {

    List<UserDevice> findByAgentAndUserIdAndIpAddressAndExpiresAtAfterAndIsVerifiedTrue(String agent, Long userId, String ipAddress, LocalDateTime expiresAt);

    List<UserDevice> findByAgentAndUserIdAndIpAddressAndExpiresAtAfterAndIsVerifiedFalse(String agent, Long userId, String ipAddress, LocalDateTime expiresAt);

    List<UserDevice> findByAgentAndUserIdAndIpAddressAndExpiresAtAfter(String agent, Long userId, String ipAddress, LocalDateTime expiresAt);
}
