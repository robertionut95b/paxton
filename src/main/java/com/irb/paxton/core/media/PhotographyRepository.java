package com.irb.paxton.core.media;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PhotographyRepository extends JpaRepository<Photography, Long> {
    Optional<Photography> findByName(String name);

}
