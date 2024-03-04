package com.irb.paxton.security.auth;

import com.irb.paxton.security.auth.user.PaxtonUserDetails;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service("userDetailsService")
@Transactional
public class PaxtonUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public PaxtonUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String lookup) throws UsernameNotFoundException {
        User user = this.userService.findByUsername(lookup)
                .orElseThrow(() -> new UsernameNotFoundException("User %s does not exist".formatted(lookup)));
        return new PaxtonUserDetails(user);
    }
}
