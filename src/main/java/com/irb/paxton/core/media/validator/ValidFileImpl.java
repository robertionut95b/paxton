package com.irb.paxton.core.media.validator;

import com.irb.paxton.storage.validator.DocumentFileValidatorService;
import com.irb.paxton.storage.validator.ImageFileValidatorService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@RequiredArgsConstructor
public class ValidFileImpl implements ConstraintValidator<ValidFile, MultipartFile> {

    private final ImageFileValidatorService imageFileValidatorService;

    private final DocumentFileValidatorService documentFileValidatorService;

    @Override
    public void initialize(ValidFile constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext constraintValidatorContext) {
        return imageFileValidatorService.checkIsValid(multipartFile) || documentFileValidatorService.checkIsValid(multipartFile);
    }
}
