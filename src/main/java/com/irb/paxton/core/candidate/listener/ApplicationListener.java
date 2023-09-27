package com.irb.paxton.core.candidate.listener;

import com.irb.paxton.core.candidate.Application;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.NotNull;

public class ApplicationListener {

    @PreUpdate
    @PrePersist
    public void setLastUpdate(@NotNull Application application) {
        // get the latest application step
        var applicationProcessStep = application.getProcessSteps()
                .stream().max(java.util.Comparator.naturalOrder());
        // set current step
        applicationProcessStep.ifPresent(applicationProcessSteps -> application.setCurrentStep(applicationProcessSteps.getProcessStep()));
    }
}
