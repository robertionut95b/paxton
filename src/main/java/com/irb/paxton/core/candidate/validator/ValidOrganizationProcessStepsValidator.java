package com.irb.paxton.core.candidate.validator;

import com.irb.paxton.core.candidate.Application;
import com.irb.paxton.core.candidate.ApplicationProcessSteps;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessSteps;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import java.util.Collection;
import java.util.Optional;

public class ValidOrganizationProcessStepsValidator implements ConstraintValidator<ValidOrganizationProcessSteps, Collection<ApplicationProcessSteps>> {

    @Override
    public void initialize(ValidOrganizationProcessSteps constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Collection<ApplicationProcessSteps> applicationProcessSteps, ConstraintValidatorContext constraintValidatorContext) {
        Optional<ApplicationProcessSteps> firstStep = applicationProcessSteps.stream().findFirst();
        if (firstStep.isPresent()) {
            ApplicationProcessSteps firstAppStep = firstStep.get();
            Application application = firstAppStep.getApplication();
            Process orgProcess = application.getJobListing().getOrganization().getRecruitmentProcess();
            Collection<ProcessSteps> orgProcessProcessSteps = orgProcess.getProcessSteps();
            Collection<ProcessSteps> applicationsProcessSteps = applicationProcessSteps.stream().map(ApplicationProcessSteps::getProcessStep).toList();
            // check if valid process steps are assigned to collection - as configured in the organization's process
            return applicationsProcessSteps.stream().anyMatch(orgProcessProcessSteps::contains);
        }
        return true;
    }
}
