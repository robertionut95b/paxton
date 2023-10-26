package com.irb.paxton.security.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse {

    protected String message;

    protected int status;

    protected String code = "SUCCESS";

    public ApiResponse(String message, int status) {
        this.message = message;
        this.status = status;
    }
}
