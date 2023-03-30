package com.irb.paxton.exceptions.handler.common;

public class GenericEntityNotFoundException extends AbstractNotFoundException {

    public GenericEntityNotFoundException(String message) {
        super(message);
    }

    public GenericEntityNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
