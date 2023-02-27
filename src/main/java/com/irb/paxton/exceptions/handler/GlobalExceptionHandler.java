package com.irb.paxton.exceptions.handler;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

//    @ExceptionHandler(Exception.class)
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    public ResponseEntity<Object> handleDefaultException(Exception ex, WebRequest webRequest) {
//        HttpStatus errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
//        log.error(ex.getMessage(), ex);
//        return this.handleExceptionInternal(ex, "Unexpected Internal Server Error", new HttpHeaders(), errorCode, webRequest);
//    }
}