package com.irb.paxton.core.model.security;

import com.irb.paxton.core.search.PaginatedResponse;
import com.irb.paxton.core.search.SlicedResponse;
import org.springframework.security.core.Authentication;

public interface PaginationSecurityService {

    boolean isSecured(Authentication authentication, PaginatedResponse<Object> response);

    boolean isSecured(Authentication authentication, SlicedResponse<Object> response);
}
