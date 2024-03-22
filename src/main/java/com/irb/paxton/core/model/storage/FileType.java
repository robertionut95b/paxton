package com.irb.paxton.core.model.storage;

import com.irb.paxton.core.model.StringIdentifiableEnum;

public enum FileType implements StringIdentifiableEnum {

    PDF_DOCUMENT("pdf"),
    IMAGE_PNG("png"),
    IMAGE_JPEG("jpg");

    private final String code;

    FileType(String code) {
        this.code = code;
    }

    public static FileType parseString(String string) {
        for (FileType b : FileType.values()) {
            if (b.code.equalsIgnoreCase(string)) {
                return b;
            }
        }
        return null;
    }

    @Override
    public String getCode() {
        return this.code;
    }
}
