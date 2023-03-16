package com.irb.paxton.core.candidate.projection;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationsCountByStep {

    public Long applicationsCount;

    public String stepTitle;

}
