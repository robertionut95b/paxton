package com.irb.paxton.core.media;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhotographyRepository extends AbstractRepository<Photography, Long> {

    Optional<Photography> findByName(String name);
}
