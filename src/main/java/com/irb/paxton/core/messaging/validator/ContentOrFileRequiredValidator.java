package com.irb.paxton.core.messaging.validator;

import com.irb.paxton.core.messaging.Message;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class ContentOrFileRequiredValidator implements ConstraintValidator<ContentOrFileRequiredValidation, Message> {

    @Override
    public boolean isValid(Message message, ConstraintValidatorContext constraintValidatorContext) {
        if (message.getContent() == null && (message.getFileContents() == null || message.getFileContents().isEmpty())) {
            constraintValidatorContext
                    .buildConstraintViolationWithTemplate("Either message content or file upload is required")
                    .addConstraintViolation()
                    .disableDefaultConstraintViolation();
            return false;
        }
        return true;
    }
}
