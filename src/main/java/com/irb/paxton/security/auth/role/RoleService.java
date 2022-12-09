package com.irb.paxton.security.auth.role;

import com.irb.paxton.security.auth.privilege.Privilege;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Collection;

@Service
public class RoleService {

    @Autowired
    private RoleRepository roleRepository;

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
