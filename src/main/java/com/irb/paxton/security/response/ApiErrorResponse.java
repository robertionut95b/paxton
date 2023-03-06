package com.irb.paxton.security.response;

import lombok.Data;

import java.util.Collections;
import java.util.List;

@Data
public class ApiErrorResponse extends ApiResponse {

    private List<String> errors;

    public ApiErrorResponse(int status, String message, List<String> errors) {
        super();
        this.status = status;
        this.message = message;
        this.errors = errors;
    }

    public ApiErrorResponse(int status, String message, String error) {
        super();
        this.status = status;
        this.message = message;
        errors = Collections.singletonList(error);
    }
}
