package com.irb.paxton.core.search.validation;

import com.irb.paxton.core.search.FilterRequest;
import com.irb.paxton.core.search.Operator;
import com.irb.paxton.utils.DateUtils;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

import java.util.List;

public class FilterRequestValidator implements ConstraintValidator<FilterRequestValid, FilterRequest> {

    @Override
    public void initialize(FilterRequestValid constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(FilterRequest filterRequest, ConstraintValidatorContext constraintValidatorContext) {
        Operator operator = filterRequest.getOperator();
        Object value = filterRequest.getValue();
        Object valueTo = filterRequest.getValueTo();
        List<Object> values = filterRequest.getValues();

        switch (operator) {
            case GREATER_THAN, GREATER_THAN_EQUAL, LESS_THAN, LESS_THAN_EQUAL -> {
                return this.handleGtLtTypes(filterRequest.getKey(), value, constraintValidatorContext);
            }
            case NOT_IN, IN -> {
                return this.handleListTypes(filterRequest.getKey(), values, constraintValidatorContext);
            }
            case BETWEEN -> {
                return this.handleRangeTypes(filterRequest.getKey(), value, valueTo, constraintValidatorContext);
            }
            default -> {
                return true;
            }
        }
    }

    private boolean handleRangeTypes(String key, Object valueFrom, Object valueTo, ConstraintValidatorContext constraintValidatorContext) {
        if (valueFrom == null || valueTo == null) {
            String notNullRangeErrMsg = "Values from/to in [%s] cannot be null";
            constraintValidatorContext
                    .buildConstraintViolationWithTemplate(notNullRangeErrMsg.formatted(key))
                    .addConstraintViolation()
                    .disableDefaultConstraintViolation();
            return false;
        }
        if (
                !(valueFrom instanceof Number) || !(valueTo instanceof Number) ||
                        !(DateUtils.isValidDate(String.valueOf(valueFrom)) || DateUtils.isValidDateTime(String.valueOf(valueFrom))) ||
                        !(DateUtils.isValidDate(String.valueOf(valueTo)) || DateUtils.isValidDateTime(String.valueOf(valueTo)))
        ) {
            String notValidRangeErrMsg = "Values from/to in [%s] are non date/numerical type";
            constraintValidatorContext
                    .buildConstraintViolationWithTemplate(notValidRangeErrMsg.formatted(key))
                    .addConstraintViolation()
                    .disableDefaultConstraintViolation();
            return false;
        }
        return true;
    }

    private boolean handleGtLtTypes(String key, Object value, ConstraintValidatorContext constraintValidatorContext) {
        if (value == null) {
            String notNullErrMsg = "Value in [%s] cannot be null";
            constraintValidatorContext
                    .buildConstraintViolationWithTemplate(notNullErrMsg.formatted(key))
                    .addConstraintViolation()
                    .disableDefaultConstraintViolation();
            return false;
        }
        if (!(value instanceof Number || (DateUtils.isValidDate(String.valueOf(value)) || DateUtils.isValidDateTime(String.valueOf(value))))) {
            String notValidErrMsg = "Value in [%s] is non date/numerical type";
            constraintValidatorContext
                    .buildConstraintViolationWithTemplate(notValidErrMsg.formatted(key))
                    .addConstraintViolation()
                    .disableDefaultConstraintViolation();
            return false;
        }
        return true;
    }

    private boolean handleListTypes(String key, List<Object> values, ConstraintValidatorContext constraintValidatorContext) {
        if (values == null || values.isEmpty()) {
            String notNullBlankListErrMsg = "Values list for [%s] cannot be null or blank";
            constraintValidatorContext
                    .buildConstraintViolationWithTemplate(notNullBlankListErrMsg.formatted(key))
                    .addConstraintViolation()
                    .disableDefaultConstraintViolation();
            return false;
        }
        return true;
    }
}
