package com.irb.paxton.security.auth.role;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.AbstractService;
import com.irb.paxton.security.auth.privilege.Privilege;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class RoleService extends AbstractService<Role, Long> {

    @Autowired
    private RoleRepository roleRepository;

    protected RoleService(AbstractRepository<Role, Long> repository) {
        super(repository);
    }

    @Transactional
    public Role createRoleIfNotFound(String name, Collection<Privilege> privileges) {
        Role role = this.roleRepository.findByName(name);
        if (role == null) {
            role = new Role(name, null);
            role.setPrivileges(privileges);
            this.roleRepository.save(role);
        }
        return role;
    }

    public Role findByName(String name) {
        return this.roleRepository.findByName(name);
    }
}
