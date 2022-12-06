package com.irb.paxton.security.auth.utils;

import com.irb.paxton.security.auth.role.Role;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;

public class AuthoritiesUtils {

    public static Collection<? extends GrantedAuthority> getAuthorities(Collection<Role> roles) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        for (Role role : roles) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
            role.getPrivileges().stream()
                    .map(p -> new SimpleGrantedAuthority(p.getName()))
                    .forEach(authorities::add);
        }
        return authorities;
    }

    public static boolean isGrantedThisAuthority(String authority, Collection<? extends GrantedAuthority> authorities) {
        return authorities.stream().anyMatch(a -> Objects.equals(a.getAuthority(), authority));
    }
}
