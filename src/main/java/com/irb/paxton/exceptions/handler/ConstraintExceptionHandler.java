package com.irb.paxton.exceptions.handler;

import com.irb.paxton.security.response.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;

import javax.validation.ConstraintViolationException;

public class ConstraintExceptionHandler {

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    ResponseEntity<ApiResponse> handleConstraintViolationException(ConstraintViolationException e) {
        return new ResponseEntity<ApiResponse>(new ApiResponse(
                "Input validation failed due to: " + e.getMessage(),
                HttpStatus.BAD_REQUEST.value()
        ), HttpStatus.BAD_REQUEST);
    }
}
