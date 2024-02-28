package com.irb.paxton.core.search;

import com.irb.paxton.core.model.IdentifiableEnumUtils;
import com.irb.paxton.utils.ClassNameUtils;
import lombok.extern.slf4j.Slf4j;

import java.time.OffsetDateTime;

@Slf4j
public enum FieldType {

    BOOLEAN {
        public Object parse(String value) {
            return Boolean.valueOf(value);
        }
    },

    CHAR {
        public Object parse(String value) {
            return value.charAt(0);
        }
    },

    DATE {
        public Object parse(String value) {
            OffsetDateTime formatter = OffsetDateTime.parse(value);
            return formatter.toLocalDate();
        }
    },

    DATETIME {
        public Object parse(String value) {
            OffsetDateTime formatter = OffsetDateTime.parse(value);
            return formatter.toLocalDateTime();
        }
    },

    DOUBLE {
        public Object parse(String value) {
            return Double.valueOf(value);
        }
    },

    INTEGER {
        public Object parse(String value) {
            return Integer.valueOf(value);
        }
    },

    LONG {
        public Object parse(String value) {
            return Long.valueOf(value);
        }
    },

    ENUM {
        public Object parse(String value) {
            try {
                String[] values = value.split(";");
                String enumType = values[0];
                String enumValue = values[1];
                return IdentifiableEnumUtils.getEnum(enumValue, ClassNameUtils.findClassByNameNoDupes(enumType, null).getName());
            } catch (IndexOutOfBoundsException e) {
                throw new IllegalArgumentException("Provided enum value must be of format 'EnumType;Value'");
            }
        }
    },

    STRING {
        public Object parse(String value) {
            return value;
        }
    };

    public abstract Object parse(String value);
}
