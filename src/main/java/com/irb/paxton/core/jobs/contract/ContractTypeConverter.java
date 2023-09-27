package com.irb.paxton.core.jobs.contract;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class ContractTypeConverter implements AttributeConverter<ContractType, String> {

    @Override
    public String convertToDatabaseColumn(ContractType contractType) {
        if (contractType == null) {
            return null;
        }
        return contractType.getCode();
    }

    @Override
    public ContractType convertToEntityAttribute(String s) {
        if (s == null) {
            return null;
        }

        return Stream.of(ContractType.values())
                .filter(c -> c.getCode().equals(s))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
