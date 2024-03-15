package com.irb.paxton.storage;

import com.irb.paxton.core.model.AbstractRepository;
import com.irb.paxton.core.model.storage.AbstractFileEntity;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface FileServingRepository extends AbstractRepository<AbstractFileEntity> {

    Optional<AbstractFileEntity> findByName(String name);

    Optional<AbstractFileEntity> findByUrlId(String urlId);

    Optional<AbstractFileEntity> findByPath(String path);

    Optional<AbstractFileEntity> findByNameAndProvider(String name, FileProvider provider);
}
