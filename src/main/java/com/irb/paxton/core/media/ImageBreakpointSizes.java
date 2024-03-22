package com.irb.paxton.core.media;

import com.irb.paxton.core.model.StringIdentifiableEnum;

/*
    Enumeration based on various breakpoints for devices screen sizes (in pixels)
 */
public enum ImageBreakpointSizes implements StringIdentifiableEnum {
    EXTRA_XS_SMALL("288"),
    EXTRA_SMALL("576"),
    SMALL("640"),
    MEDIUM("768"),
    LARGE("1024"),
    EXTRA_LARGE("1280");

    private final String code;

    ImageBreakpointSizes(String code) {
        this.code = code;
    }

    @Override
    public String getCode() {
        return this.code;
    }

    public Integer toIntValue() {
        return Integer.parseInt(this.code);
    }
}
