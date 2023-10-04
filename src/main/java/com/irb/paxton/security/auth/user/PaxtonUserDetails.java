package com.irb.paxton.security.auth.user;

import com.irb.paxton.security.auth.utils.AuthoritiesUtils;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.Map;

public class PaxtonUserDetails extends User implements OAuth2User, UserDetails {

    private Map<String, Object> attributes;

    public PaxtonUserDetails(final User user) {
        super(user);
    }

    public PaxtonUserDetails(final User user, Map<String, Object> attributes) {
        super(user);
        this.attributes = attributes;
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

    @Override
    public Map<String, Object> getAttributes() {
        return this.attributes;
    }

    public void setAttributes(Map<String, Object> attributes) {
        this.attributes = attributes;
    }

    @Override
    public String getName() {
        return this.getId().toString();
    }
}
