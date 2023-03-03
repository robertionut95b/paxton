package com.irb.paxton.core.candidate.mapper;

import com.irb.paxton.core.model.AbstractInput;
import com.irb.paxton.core.model.PaxtonEntity;
import lombok.SneakyThrows;
import org.mapstruct.ObjectFactory;
import org.mapstruct.TargetType;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Component
public class ReferenceMapper {

    @PersistenceContext
    private EntityManager entityManager;

    @SneakyThrows
    @ObjectFactory
    public <T extends PaxtonEntity<Long>> T resolve(AbstractInput abstractInput, @TargetType Class<T> type) {
        if (abstractInput.getId() == null) {
            return type.newInstance();
        }
        T entity = entityManager.find(type, abstractInput.getId());
        return entity != null ? entity : type.newInstance();
    }
}
