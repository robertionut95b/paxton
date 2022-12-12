package com.irb.paxton.security.auth.user.response;

import com.irb.paxton.core.organization.Organization;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CurrentUserDetails {

    private Organization organization;
}
