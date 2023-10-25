package com.irb.paxton.storage.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

public class FileNotFoundException extends AbstractNotFoundException {

    public FileNotFoundException(String message) {
        super(message);
    }

}
