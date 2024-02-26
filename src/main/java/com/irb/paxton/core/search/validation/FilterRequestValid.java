package com.irb.paxton.core.search.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Constraint(validatedBy = FilterRequestValidator.class)
@Target({ElementType.TYPE})
@Retention(RetentionPolicy.RUNTIME)
public @interface FilterRequestValid {

    String message() default "Invalid filter request";
    
    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
