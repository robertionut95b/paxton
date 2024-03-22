package com.irb.paxton.core.media.validator;

import com.irb.paxton.storage.validator.DocumentFileValidatorService;
import com.irb.paxton.storage.validator.ImageFileValidatorService;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
public class ValidFileListImpl implements ConstraintValidator<ValidFile, List<MultipartFile>> {

    private final ImageFileValidatorService imageFileValidatorService;

    private final DocumentFileValidatorService documentFileValidatorService;

    @Override
    public void initialize(ValidFile constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(List<MultipartFile> multipartFileList, ConstraintValidatorContext constraintValidatorContext) {
        return multipartFileList.stream().anyMatch(
                multipartFile -> imageFileValidatorService.checkIsValid(multipartFile) || documentFileValidatorService.checkIsValid(multipartFile)
        );
    }
}
