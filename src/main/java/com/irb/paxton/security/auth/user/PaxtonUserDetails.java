package com.irb.paxton.security.auth.user;

import com.irb.paxton.security.auth.utils.AuthoritiesUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;

public class PaxtonUserDetails extends User implements UserDetails {

    public PaxtonUserDetails(final User user) {
        super(user);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return AuthoritiesUtils.getAuthorities(this.getRoles());
    }

    @Override
    public String getPassword() {
        return this.getCredentials().getValue();
    }

    @Override
    public String getUsername() {
        return super.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.isEmailConfirmed();
    }
}
