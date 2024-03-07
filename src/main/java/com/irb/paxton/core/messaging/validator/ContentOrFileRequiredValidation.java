package com.irb.paxton.core.messaging.validator;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = ContentOrFileRequiredValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface ContentOrFileRequiredValidation {

    String message() default "Either message content or file upload is required";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
