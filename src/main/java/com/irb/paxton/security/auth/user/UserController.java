package com.irb.paxton.security.auth.user;

import com.irb.paxton.security.auth.jwt.JwtTokenProvider;
import com.irb.paxton.security.auth.user.dto.UserLoginResponseDto;
import com.irb.paxton.security.auth.user.exceptions.UserNotFoundException;
import com.irb.paxton.security.auth.user.mapper.UserLoginMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletRequest;
import java.security.Principal;
import java.time.Instant;
import java.util.List;

import static com.irb.paxton.config.properties.ApplicationProperties.API_VERSION;

@RestController
@RequestMapping(path = "api/" + API_VERSION + "/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    @Autowired
    private UserLoginMapper mapper;

    @GetMapping
    @Secured("ROLE_ADMINISTRATOR")
    List<User> getUsers(Authentication authentication) {
        return userService.getUsers();
    }

    @PostMapping(path = "/current")
    public UserLoginResponseDto getUserInformation(HttpServletRequest request, Principal principal) {
        String token = jwtTokenProvider.resolveToken(request);
        Instant expiresAt = jwtTokenProvider.getExpirationDateFromToken(token);
        User user = this.userService.findByUsername(principal.getName())
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        return mapper.userToUserLoginResponseDto(user, expiresAt);
    }
}
