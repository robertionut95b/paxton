package com.irb.paxton.core.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.io.Serializable;

@JsonIgnoreProperties(ignoreUnknown = true)
public interface Identifiable<T> extends Serializable {

    static String classObjectType(Class<?> cls) {
        return cls.getSimpleName().toUpperCase();
    }

    T getId();

    void setId(T id);

    default String getObjectType() {
        return classObjectType(this.getClass());
    }
}
