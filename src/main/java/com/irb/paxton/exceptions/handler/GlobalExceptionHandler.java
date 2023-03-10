package com.irb.paxton.exceptions.handler;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;
import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;
import com.irb.paxton.security.response.ApiErrorResponse;
import com.irb.paxton.storage.exception.FileStorageException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import javax.validation.ConstraintViolation;
import javax.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
@Slf4j
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler({AuthenticationException.class})
    public ResponseEntity<Object> handleAuthenticationException(AuthenticationException exception) {
        log.error(exception.getMessage(), exception);
        return new ResponseEntity<>(
                new ApiErrorResponse(HttpStatus.UNAUTHORIZED.value(), exception.getLocalizedMessage()),
                new HttpHeaders(), HttpStatus.UNAUTHORIZED.value()
        );
    }

    @ExceptionHandler({AccessDeniedException.class})
    public ResponseEntity<Object> handleAccessDenied(AccessDeniedException exception) {
        return new ResponseEntity<>(
                new ApiErrorResponse(HttpStatus.FORBIDDEN.value(), "Access denied", exception.getLocalizedMessage()),
                new HttpHeaders(), HttpStatus.FORBIDDEN.value()
        );
    }

    @ExceptionHandler({AbstractNotFoundException.class})
    public ResponseEntity<Object> handleNotFoundException(AbstractNotFoundException exception) {
        return new ResponseEntity<>(
                new ApiErrorResponse(HttpStatus.NOT_FOUND.value(), "Could not find requested entity", exception.getLocalizedMessage()),
                new HttpHeaders(), HttpStatus.NOT_FOUND.value()
        );
    }

    @ExceptionHandler({AbstractAlreadyExistsException.class})
    public ResponseEntity<Object> handleDuplicateEntityException(AbstractAlreadyExistsException exception) {
        return new ResponseEntity<>(
                new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), "Could not alter entity", exception.getLocalizedMessage()),
                new HttpHeaders(), HttpStatus.BAD_REQUEST.value()
        );
    }

    @ExceptionHandler({ConstraintViolationException.class})
    public ResponseEntity<Object> handleConstraintViolation(ConstraintViolationException ex, WebRequest request) {
        List<String> errors = new ArrayList<>();
        for (ConstraintViolation<?> violation : ex.getConstraintViolations()) {
            errors.add(violation.getRootBeanClass().getName() + " " + violation.getPropertyPath() + ": " + violation.getMessage());
        }
        log.error(ex.getMessage(), ex);
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(HttpStatus.BAD_REQUEST.value(), ex.getLocalizedMessage(), errors);
        return new ResponseEntity<>(
                apiErrorResponse, new HttpHeaders(), apiErrorResponse.getStatus());
    }

    @ExceptionHandler({FileStorageException.class})
    public ResponseEntity<Object> handleFileStorageException(Exception ex) {
        log.error(ex.getMessage(), ex);
        HttpStatus errorCode = HttpStatus.UNPROCESSABLE_ENTITY;
        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode.value(), "File storage error", "Could not load or store the media file");
        return new ResponseEntity<>(
                apiErrorResponse, new HttpHeaders(), apiErrorResponse.getStatus()
        );
    }

//    @ExceptionHandler(Exception.class)
//    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
//    public ResponseEntity<Object> handleDefaultException(Exception ex, WebRequest webRequest) {
//        log.error(ex.getMessage(), ex);
//        HttpStatus errorCode = HttpStatus.INTERNAL_SERVER_ERROR;
//        ApiErrorResponse apiErrorResponse = new ApiErrorResponse(errorCode.value(), "Internal error", "Unknown internal exception occurred");
//        return new ResponseEntity<>(
//                apiErrorResponse, new HttpHeaders(), apiErrorResponse.getStatus()
//        );
//    }
}
