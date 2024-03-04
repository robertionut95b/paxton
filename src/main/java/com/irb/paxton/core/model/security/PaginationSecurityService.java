package com.irb.paxton.core.model.security;

import com.irb.paxton.core.search.PaginatedResponse;
import org.springframework.security.core.Authentication;

public interface PaginationSecurityService {

    boolean isSecured(Authentication authentication, PaginatedResponse<Object> response);
}
