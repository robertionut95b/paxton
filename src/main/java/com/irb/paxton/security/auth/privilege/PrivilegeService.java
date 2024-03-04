package com.irb.paxton.security.auth.privilege;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class PrivilegeService extends AbstractService<Privilege> {

    private final PrivilegeRepository privilegeRepository;

    protected PrivilegeService(AbstractRepository<Privilege> repository, PrivilegeRepository privilegeRepository) {
        super(repository);
        this.privilegeRepository = privilegeRepository;
    }

    @Transactional
    public Privilege createPrivilegeIfNotFound(String name) {
        Privilege privilege = this.privilegeRepository.findByName(name);
        if (privilege == null) {
            privilege = new Privilege(name, null);
            this.privilegeRepository.persist(privilege);
        }
        return privilege;
    }
}
