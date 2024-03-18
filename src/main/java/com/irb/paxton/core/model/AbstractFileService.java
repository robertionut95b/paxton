package com.irb.paxton.core.model;

import com.irb.paxton.core.model.storage.AbstractFileEntity;

import java.util.Optional;

public abstract class AbstractFileService<T extends AbstractFileEntity> extends AbstractService<T> {

    private final AbstractFileEntityRepository<T> repository;

    protected AbstractFileService(AbstractFileEntityRepository<T> repository) {
        super(repository);
        this.repository = repository;
    }

    public Optional<T> findByNameOptional(String imageName) {
        return this.repository.findByName(imageName);
    }
}
