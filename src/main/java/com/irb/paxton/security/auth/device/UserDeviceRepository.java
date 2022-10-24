package com.irb.paxton.security.auth.device;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface UserDeviceRepository extends JpaRepository<UserDevice, Long> {

    List<UserDevice> findByAgentAndUserIdAndIpAddressAndExpiresAtAfterAndIsVerifiedTrue(String agent, Long userId, String ipAddress, LocalDateTime expiresAt);

    List<UserDevice> findByAgentAndUserIdAndIpAddressAndExpiresAtAfterAndIsVerifiedFalse(String agent, Long userId, String ipAddress, LocalDateTime expiresAt);

    List<UserDevice> findByAgentAndUserIdAndIpAddressAndExpiresAtAfter(String agent, Long userId, String ipAddress, LocalDateTime expiresAt);
}
