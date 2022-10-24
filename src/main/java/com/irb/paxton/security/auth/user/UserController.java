package com.irb.paxton.security.auth.user;

import com.irb.paxton.security.response.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;
import static com.irb.paxton.security.SecurityUtils.isFullyAuthenticated;

@RestController
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @GetMapping
    @Secured("ROLE_ADMINISTRATOR")
    List<User> getUsers(Authentication authentication) {
        return userService.getUsers();
    }

    @PostMapping(path = "/currentUser")
    public ResponseEntity<?> getUserInformation() {
        if (!isFullyAuthenticated()) {
            return new ResponseEntity<>(new ApiResponse("Not authenticated", 401), HttpStatus.UNAUTHORIZED);
        }
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<String> authorities = auth.getAuthorities().stream().map(Object::toString).toList();

        HashMap<String, Object> resp = new HashMap<>();
        resp.put("permissions", authorities);
        resp.put("username", auth.getName());

        return ResponseEntity.ok().body(resp);
    }
}
