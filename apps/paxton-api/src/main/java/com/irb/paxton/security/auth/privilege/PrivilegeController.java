package com.irb.paxton.security.auth.privilege;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION + "/privileges")
public class PrivilegeController {

    @Autowired
    private PrivilegeService privilegeService;

    @GetMapping
    @Secured("ROLE_ADMINISTRATOR")
    List<Privilege> getPrivileges() {
        return this.privilegeService.getAllPrivileges();
    }
}
