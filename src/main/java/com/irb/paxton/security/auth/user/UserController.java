package com.irb.paxton.security.auth.user;

import com.irb.paxton.security.auth.jwt.JwtUtils;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;

import static com.irb.paxton.config.ApplicationProperties.API_VERSION;
import static com.irb.paxton.security.SecurityUtils.getAuthorities;

@RestController
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @GetMapping
    @Secured("ROLE_ADMINISTRATOR")
    List<User> getUsers(Authentication authentication) {
        return userService.getUsers();
    }

    @PostMapping(path = "/currentUser")
    public ResponseEntity<?> getUserInformation(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        List<String> authorities = getAuthorities(auth).map(Object::toString).toList();
        Instant expiresAt = jwtUtils.getExpiresAtFromToken(jwtUtils.getJwtFromCookies(request));
        User user = this.userService.findByUsername(auth.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        HashMap<String, Object> resp = new HashMap<>();
        resp.put("permissions", authorities);
        resp.put("username", auth.getName());
        resp.put("sessionTime", Duration.between(Instant.now(), expiresAt).toMillis());
        resp.put("firstName", user.getFirstName());
        resp.put("lastName", user.getLastName());

        return ResponseEntity.ok().body(resp);
    }
}
