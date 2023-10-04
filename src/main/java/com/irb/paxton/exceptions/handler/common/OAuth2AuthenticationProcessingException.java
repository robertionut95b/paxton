package com.irb.paxton.exceptions.handler.common;

import javax.naming.AuthenticationException;

public class OAuth2AuthenticationProcessingException extends AuthenticationException {

    public OAuth2AuthenticationProcessingException(String explanation) {
        super(explanation);
    }

    public OAuth2AuthenticationProcessingException() {
        super();
    }
}
