package com.irb.paxton.core.jobs.contract;

import com.irb.paxton.core.model.StringIdentifiableEnum;

public enum ContractType implements StringIdentifiableEnum {
    FULL_TIME("FULL_TIME"),
    PART_TIME("PART_TIME"),
    INTERNSHIP("INTERNSHIP"),
    FREE_PROFESSIONAL("FREE_PROFESSIONAL"),
    TEMPORARY_EMPLOYEE("TEMPORARY_EMPLOYEE"),
    PUPIL("PUPIL"),
    SEASONAL("SEASONAL");

    private final String code;

    ContractType(String code) {
        this.code = code;
    }

    @Override
    public String getCode() {
        return code;
    }
}
