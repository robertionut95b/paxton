package com.irb.paxton.core.model;

import com.irb.paxton.exceptions.handler.common.EnumNotFoundException;
import lombok.extern.slf4j.Slf4j;

import java.util.Objects;

public interface IdentifiableEnumUtils {

    static <T extends Enum<T> & StringIdentifiableEnum, S> T get(Class<T> type, S id) {
        for (T t : type.getEnumConstants()) {
            if (Objects.equals(t.getCode(), id)) {
                return t;
            }
        }
        return null;
    }

    static <E extends Enum<E>> E getEnum(String text, String className) {
        try {
            Class<E> enumClass = (Class<E>) Class.forName(className);
            return Enum.valueOf(enumClass, text);
        } catch (ClassNotFoundException e) {
            String message = "Could not find class enum class %s when parsing value %s".formatted(className, text);
            LogHolder.log.error(message, e);
            throw new EnumNotFoundException(message);
        }
    }

    @Slf4j
    final class LogHolder {
    }
}
