package com.irb.paxton.core.model.mapper;

import com.irb.paxton.core.model.input.AbstractInput;
import lombok.SneakyThrows;
import org.mapstruct.ObjectFactory;
import org.mapstruct.TargetType;
import org.springframework.stereotype.Component;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;

@Component
public class ReferenceMapper {

    @PersistenceContext
    private EntityManager entityManager;

    @SneakyThrows
    @ObjectFactory
    public <T> T resolve(AbstractInput abstractInput, @TargetType Class<T> type) {
        if (abstractInput.getId() == null) {
            return type.newInstance();
        }
        T entity = entityManager.find(type, abstractInput.getId());
        return entity != null ? entity : type.newInstance();
    }
}
