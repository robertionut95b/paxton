package com.irb.paxton.core.profile;

import com.irb.paxton.core.model.AbstractRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserProfileRepository extends AbstractRepository<UserProfile, Long> {

    Optional<UserProfile> findByUser_Id(Long id);

    Optional<UserProfile> findByUserUsername(String username);

    Optional<UserProfile> findByProfileSlugUrl(String profileSlugUrl);
}
