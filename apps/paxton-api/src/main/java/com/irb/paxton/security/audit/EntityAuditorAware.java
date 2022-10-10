package com.irb.paxton.security.audit;

import com.irb.paxton.security.SecurityUtils;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.domain.AuditorAware;

import java.util.Optional;

public class EntityAuditorAware implements AuditorAware<String> {

    @NotNull
    @Override
    public Optional<String> getCurrentAuditor() {
        return SecurityUtils.getCurrentUserLogin().or(() -> Optional.of(new String("pxSystemUser")));
    }
}
