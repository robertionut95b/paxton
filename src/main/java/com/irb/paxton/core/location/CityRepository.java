package com.irb.paxton.core.location;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CityRepository extends AbstractRepository<City, Long> {

    Optional<City> findByName(String name);
}
