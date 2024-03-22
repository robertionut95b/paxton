package com.irb.paxton.core.media.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Target({ElementType.METHOD, ElementType.FIELD, ElementType.ANNOTATION_TYPE,
        ElementType.CONSTRUCTOR, ElementType.PARAMETER, ElementType.TYPE_USE})
@Retention(RetentionPolicy.RUNTIME)
@Constraint(validatedBy = {ValidFileImpl.class, ValidFileListImpl.class})
public @interface ValidFile {
    String message() default "{px.application.files.supportedFormats}";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}