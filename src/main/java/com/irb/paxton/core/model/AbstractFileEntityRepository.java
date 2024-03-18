package com.irb.paxton.core.model;

import com.irb.paxton.core.model.storage.AbstractFileEntity;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

@NoRepositoryBean
public interface AbstractFileEntityRepository<T extends AbstractFileEntity> extends AbstractRepository<T>, JpaSpecificationExecutor<T> {

    Optional<T> findByName(String name);
}
