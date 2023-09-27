package com.irb.paxton.security.auth;

import com.irb.paxton.security.auth.user.PaxtonUserDetails;
import com.irb.paxton.security.auth.user.User;
import com.irb.paxton.security.auth.user.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;

@Service("userDetailsService")
@Transactional
public class PaxtonUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(String lookup) throws UsernameNotFoundException {
        User user = this.userService.findByUsername(lookup)
                .orElseThrow(() -> new UsernameNotFoundException("User %s does not exist".formatted(lookup)));
        return new PaxtonUserDetails(user);
    }
}
