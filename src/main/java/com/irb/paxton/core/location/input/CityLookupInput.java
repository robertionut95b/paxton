package com.irb.paxton.core.location.input;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class CityLookupInput {

    @NotNull
    private Long id;
}
