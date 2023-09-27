package com.irb.paxton.core.candidate.validator;

import com.irb.paxton.core.candidate.ApplicationProcessSteps;
import com.irb.paxton.core.process.Process;
import com.irb.paxton.core.process.ProcessSteps;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.Collection;
import java.util.Optional;

public class ProcessStepsOrderValidator implements ConstraintValidator<OrderedProcessSteps, Collection<ApplicationProcessSteps>> {

    @Override
    public void initialize(OrderedProcessSteps constraintAnnotation) {
        ConstraintValidator.super.initialize(constraintAnnotation);
    }

    @Override
    public boolean isValid(Collection<ApplicationProcessSteps> applicationProcessSteps, ConstraintValidatorContext constraintValidatorContext) {
        Optional<ApplicationProcessSteps> firstStep = applicationProcessSteps.stream().findFirst();
        if (firstStep.isPresent()) {
            Process process = firstStep.get().getProcessStep().getProcess();
            Collection<ProcessSteps> processSteps = process.getProcessSteps();
            Collection<ProcessSteps> applicationsProcessSteps = applicationProcessSteps.stream().map(ApplicationProcessSteps::getProcessStep).toList();

            boolean anyNotIncluded = applicationsProcessSteps.stream().anyMatch(processSteps::contains);
            if (!anyNotIncluded) {
                return false;
            }

            if (applicationProcessSteps.size() == processSteps.size()) {
                boolean allIncluded = applicationsProcessSteps.containsAll(processSteps);
                if (!allIncluded) {
                    return false;
                }
            }

            // check if steps are in correct ascending order
            return applicationsProcessSteps.stream().sorted().toList().equals(applicationsProcessSteps);
        }
        return true;
    }
}
