package com.irb.paxton.security.auth.user;

import com.irb.paxton.security.auth.user.response.CurrentUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    @Secured("ROLE_ADMINISTRATOR")
    List<User> getUsers(Authentication authentication) {
        return userService.getUsers();
    }

    @GetMapping(path = "/current")
    public CurrentUserDetails getUserInformation(Principal principal) {
        return this.userService.getCurrentUserDetails(principal.getName());
    }
}
