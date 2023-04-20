package com.irb.paxton.core.jobs.worktype;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;
import java.util.stream.Stream;

@Converter(autoApply = true)
public class WorkTypeConverter implements AttributeConverter<WorkType, String> {

    @Override
    public String convertToDatabaseColumn(WorkType workType) {
        if (workType == null) {
            return null;
        }
        return workType.getCode();
    }

    @Override
    public WorkType convertToEntityAttribute(String s) {
        if (s == null) {
            return null;
        }

        return Stream.of(WorkType.values())
                .filter(c -> c.getCode().equals(s))
                .findFirst()
                .orElseThrow(IllegalArgumentException::new);
    }
}
