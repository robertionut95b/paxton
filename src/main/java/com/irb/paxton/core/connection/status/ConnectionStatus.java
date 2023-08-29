package com.irb.paxton.core.connection.status;

import com.irb.paxton.core.model.StringIdentifiableEnum;

public enum ConnectionStatus implements StringIdentifiableEnum {

    REQUESTED("R"),
    ACCEPTED("A"),
    DECLINED("D"),
    BLOCKED("B");

    private final String code;

    ConnectionStatus(String code) {
        this.code = code;
    }

    @Override
    public String getCode() {
        return this.code;
    }
}
