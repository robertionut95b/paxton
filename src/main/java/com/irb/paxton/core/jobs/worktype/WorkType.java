package com.irb.paxton.core.jobs.worktype;

import com.irb.paxton.core.model.StringIdentifiableEnum;

public enum WorkType implements StringIdentifiableEnum {
    REMOTE("REMOTE"),
    ON_SITE("ON_SITE"),
    HYBRID("HYBRID");

    private final String code;

    WorkType(String code) {
        this.code = code;
    }

    @Override
    public String getCode() {
        return code;
    }
}
