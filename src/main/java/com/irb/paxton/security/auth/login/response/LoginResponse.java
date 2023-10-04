package com.irb.paxton.security.auth.login.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {

    @JsonProperty("token_type")
    public final String tokenType = "Bearer";

    @JsonProperty("scope")
    public final String scope = "READ WRITE";

    @JsonProperty("access_token")
    public String accessToken;

    @JsonProperty("expires_in")
    public Long expiresIn;

    @JsonProperty("refresh_token")
    public String refreshToken;

    @JsonProperty("refresh_expires_in")
    public Long refreshTokenExpiresIn;
}
