package com.irb.paxton.security.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ApiResponse {

    private String message;

    private int errorCode;
}
