package com.irb.paxton.security.auth.role;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepository extends AbstractRepository<Role, Long> {

    Role findByName(String name);
}
