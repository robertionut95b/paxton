package com.irb.paxton.core.organization.input;

import lombok.Data;

import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Collection;

@Data
public class RecruiterAlterInput implements Serializable {

    @NotNull
    private Long organizationId;

    @NotNull
    private Collection<RecruiterInput> recruiters;
}
