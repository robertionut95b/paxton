package com.irb.paxton.exceptions.handler;

import com.irb.paxton.security.response.ApiErrorResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler(Exception.class)
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    public ResponseEntity<Object> handleDefaultException(Exception ex, WebRequest webRequest) {
        log.error(ex.getMessage(), ex);
        HttpStatus errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode.value(), ex.getLocalizedMessage(), "Internal error");
        return new ResponseEntity<>(
                apiErrorResponse, new HttpHeaders(), apiErrorResponse.getStatus()
        );
    }
}
