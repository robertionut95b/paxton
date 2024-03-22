package com.irb.paxton.storage.exception;

import com.irb.paxton.exceptions.handler.common.AbstractAlreadyExistsException;

public class FileAlreadyExistsExceptionException extends AbstractAlreadyExistsException {

    public FileAlreadyExistsExceptionException(String message) {
        super(message);
    }

    public FileAlreadyExistsExceptionException(String message, Throwable cause) {
        super(message, cause);
    }
}
