package com.irb.paxton.core.media.exception;

import com.irb.paxton.exceptions.handler.common.AbstractNotFoundException;

public class ImageNotFound extends AbstractNotFoundException {

    public ImageNotFound(String message) {
        super(message);
    }
}
