package com.irb.paxton.security.auth.privilege;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PrivilegeRepository extends AbstractRepository<Privilege> {

    Privilege findByName(String name);
}
