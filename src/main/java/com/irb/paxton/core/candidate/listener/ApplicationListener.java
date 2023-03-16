package com.irb.paxton.core.candidate.listener;

import com.irb.paxton.core.candidate.Application;
import org.jetbrains.annotations.NotNull;

import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;

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
